import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.sql.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TCPServer {
    static ServerSocket serverSocket = null;
    static Statement statement = null;

    public TCPServer(int port, Statement sqlstatement) throws Exception {
        try {
            statement = sqlstatement;
            serverSocket = new ServerSocket(port);
            System.out.println(">TCP Server started at localhost:" + port + "\n");
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("TCP>Accepted connection from " + clientSocket.getInetAddress());
                // TCP Thread, Runnable as Lambda
                new Thread(() -> {
                    try {
                        handleRequest(clientSocket);

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }).start();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private static void handleRequest(Socket clientSocket) throws Exception {
        InputStream input = clientSocket.getInputStream();
        OutputStream output = clientSocket.getOutputStream();

        BufferedReader reader = new BufferedReader(new InputStreamReader(input));
        String line = reader.readLine();
        if (line != null) {
            String[] tokens = line.split(" ");
            if (tokens.length >= 2) {
                String method = tokens[0];
                String path = tokens[1];

                String body = parseRequestBody(reader);
                System.out.println(line + " body:{" + body + "}");
                if (method.equalsIgnoreCase("GET")) {
                    handleGet(path, output);
                } else if (method.equalsIgnoreCase("POST")) {
                    handlePost(path, body, output);
                } else {
                    sendNotFound(output);
                }
            } else {
                sendNotFound(output);
            }
        } else {
            sendNotFound(output);
        }

        output.close();
        input.close();
        clientSocket.close();
    }

    private static void handleGet(String path, OutputStream output) throws Exception {
        String response = null;
        String headers = null;
        boolean foundPath = true;
        switch (path) {
            case "/": {
                ResultSet rs = statement.executeQuery("SELECT * FROM items ORDER BY `ItemID` DESC");
                response = parseResultSet(rs).toString();
                break;
            }
            case "/categories": {
                // Categories are sent as an array of objects with property "Categories" Actual
                // Categories to be Parsed in Frontend
                // TODO:Fix resultset closing (??)
                ResultSet rs = statement
                        .executeQuery("SELECT DISTINCT JSON_KEYS(`Categories`) as `Categories` from items");
                response = parseResultSet(rs).toString();
                break;
            }

            default: {
                foundPath = false;
                break;
            }
        }
        // Sending Response
        if (foundPath) {
            headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        }
        // 404
        else {
            sendNotFound(output);
        }
    }

    private static void handlePost(String path, String body, OutputStream output) throws Exception {
        String response = null;
        String headers = null;
        boolean foundPath = true;
        switch (path) {
            case "/": {
                response = body;
                break;
            }
            case "/getbyname": {
                String query = "";
                org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
                String searchValue = parsedBody.get("searchValue").toString();
                String filterValue = parsedBody.get("filterValue").toString();
                String categoryValue = parsedBody.get("categoryValue").toString();
                if (isNumeric(searchValue)) {
                    query = "Select * FROM items WHERE ItemID =" + searchValue;
                } else {
                    if (!categoryValue.equals("")) {
                        query = "Select * FROM items WHERE Item_Name like '%" + searchValue + "%' AND " +
                                "JSON_EXTRACT(`Categories`, '$." + categoryValue + "') order by " + filterValue;
                    } else {
                        query = "SELECT * FROM items WHERE Item_Name like '%" + searchValue + "%' order by "
                                + filterValue;
                    }
                }
                ResultSet rs = statement.executeQuery(query);
                response = parseResultSet(rs).toString();

                break;
            }
            case "/sellItem": {
                String query = "";
                org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
                String imageURL = parsedBody.get("imageURL").toString();
                String itemName = parsedBody.get("itemName").toString();
                String minimumBid = parsedBody.get("minimumBid").toString();
                String itemDescription = parsedBody.get("itemDescription").toString();
                String expireDate = parsedBody.get("expireDate").toString();
                String seller = parsedBody.get("username").toString();
                String categories = parsedBody.get("categories").toString();
                if (!categories.equals("{}")) {
                    query = "INSERT INTO `items` (`Image_URL`,`Item_Name`,`Minimum_Bid`,`Item_Description`,`Seller`,`Expire_Date`,`Categories`) VALUES "
                            +
                            "('" + imageURL + "','" + itemName + "'," + minimumBid + ",\"" + itemDescription + "\",'"
                            + seller
                            + "','" + expireDate + "','" + categories + "')";
                } else {
                    query = "INSERT INTO `items` (`Image_URL`,`Item_Name`,`Minimum_Bid`,`Item_Description`,`Seller`,`Expire_Date`) VALUES "
                            +
                            "('" + imageURL + "','" + itemName + "'," + minimumBid + ",\"" + itemDescription + "\",'"
                            + seller
                            + "','" + expireDate + "')";
                }

                response = Integer.toString(statement.executeUpdate(query));
                break;
            }
            case "/offerPage": {
                if (!body.isEmpty() && isNumeric(body)) {
                    ResultSet rs = statement.executeQuery("Select * from items where ItemID = " + body);
                    response = parseResultSet(rs).toString();
                } else
                    sendNotFound(output);
                break;
            }
            case "/profile": {
                org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
                String uuid = parsedBody.get("uuid").toString();
                String query = "SELECT `Username`,`Birth_Date`,`Email`,`Balance` FROM users WHERE `UserUUID` = '" + uuid + "';";
                ResultSet rs = statement.executeQuery(query);
                response = parseResultSet(rs).toString();
                break;
            }
            case "/uuidtousername": {
                if (!body.isEmpty()) {
                    ResultSet rs = statement.executeQuery("Select Username from users where UserUUID = '" + body + "'");
                    response = parseResultSet(rs).toString();
                } else
                    response = "[{\"Username\":\"Nobody\"}]";
                break;
            }
            case "/emailtousername": {
                ResultSet rs = statement.executeQuery("Select Username from users where Email = '" + body + "'");
                response = parseResultSet(rs).toString();
                break;
            }
            case "/login": {
                String query = "";
                org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
                String nameInput = parsedBody.get("nameInput").toString();
                String password = EncryptionUtils.encrypt(parsedBody.get("password").toString());
                if (isValidEmail(nameInput)) {
                    query = "SELECT userUUID FROM users WHERE Email = '" + nameInput + "' AND Password = '" + password
                            + "';";
                } else {
                    query = "SELECT userUUID FROM users WHERE Username = '" + nameInput + "' AND Password = '"
                            + password
                            + "';";
                }
                ResultSet rs = statement.executeQuery(query);
                response = parseResultSet(rs).toString();
                break;
            }
            case "/register": {
                org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
                String username = parsedBody.get("username").toString();
                String password = EncryptionUtils.encrypt(parsedBody.get("password").toString());
                String birthDate = parsedBody.get("birthDate").toString();
                String email = parsedBody.get("email").toString();

                String insertquery = "INSERT INTO `users` (`Username`, `Password`, `Birth_Date`, `Email`) VALUES" +
                        "('" + username + "', '" + password + "', '" + birthDate + "', '" + email + "');";
                int rs = statement.executeUpdate(insertquery);
                if (rs > 0) {
                    ResultSet res = statement.executeQuery(
                            "SELECT userUUID FROM users WHERE Email = '" + email + "' AND Password = '" + password
                                    + "';");
                    response = parseResultSet(res).toString();
                } else
                    response = "[]";
                break;
            }

            default: {
                foundPath = false;
                break;
            }
        }
        // Sending Response
        if (foundPath) {
            headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        }
        // 404
        else {
            sendNotFound(output);
        }
    }

    private static void sendNotFound(OutputStream output) throws Exception {
        String response = "404 Not Found";
        String headers = "HTTP/1.1 404 Not Found\r\n" +
                "Content-Type: text/plain\r\n" +
                "Access-Control-Allow-Origin: *\r\n" +
                "Content-Length: " + response.length() + "\r\n" +
                "\r\n";
        output.write(headers.getBytes());
        output.write(response.getBytes());
    }

    private static String parseRequestBody(BufferedReader reader) throws Exception {
        // headers
        Map<String, String> headers = new HashMap<>();
        String headerLine;
        while ((headerLine = reader.readLine()) != null && !headerLine.isEmpty()) {
            String[] headerTokens = headerLine.split(":");
            if (headerTokens.length == 2) {
                headers.put(headerTokens[0].trim(), headerTokens[1].trim());
            }
        }
        // body
        int contentLength = Integer.parseInt(headers.getOrDefault("Content-Length", "0"));
        char[] buffer = new char[1024];
        StringBuilder bodyBuilder = new StringBuilder();
        int bytesRead;
        while ((bytesRead = reader.read(buffer, 0, Math.min(buffer.length, contentLength))) > 0) {
            bodyBuilder.append(buffer, 0, bytesRead);
            contentLength -= bytesRead;
            if (contentLength <= 0) {
                break;
            }
        }
        String body = bodyBuilder.toString();
        return body;
    }

    private static JSONArray parseResultSet(ResultSet resultSet) throws SQLException {
        ResultSet copyResultSet = resultSet;
        ResultSetMetaData md = copyResultSet.getMetaData();
        int numCols = md.getColumnCount();
        List<String> colNames = IntStream.range(0, numCols)
                .mapToObj(i -> {
                    try {
                        return md.getColumnName(i + 1);
                    } catch (SQLException e) {
                        e.printStackTrace();
                        return "?";
                    }
                })
                .collect(Collectors.toList());

        JSONArray result = new JSONArray();
        try {
            while (copyResultSet.next()) {
                JSONObject row = new JSONObject();
                colNames.forEach(cn -> {
                    try {
                        row.put(cn, copyResultSet.getObject(cn));
                    } catch (JSONException | SQLException e) {
                        e.printStackTrace();
                    }
                });
                result.put(row);
            }
        } catch (SQLException e) {
            System.out.println("ResultSet Closed, Client will probably need to reload page");
        }
        return result;
    }

    private static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        try {
            Double.parseDouble(strNum);
        } catch (NumberFormatException nfe) {
            return false;
        }
        return true;
    }

    public static boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\." +
                "[a-zA-Z0-9_+&*-]+)*@" +
                "(?:[a-zA-Z0-9-]+\\.)+[a-z" +
                "A-Z]{2,7}$";

        Pattern pattern = Pattern.compile(emailRegex);
        if (email == null) {
            return false;
        }
        return pattern.matcher(email).matches();
    }
}