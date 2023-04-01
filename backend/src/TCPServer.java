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
                System.out.println("Accepted connection from " + clientSocket.getInetAddress());
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
        // Endpoint Root
        if (path.equals("/")) {
            ResultSet rs = statement.executeQuery("Select * from items");
            String response = parseResultSet(rs).toString();
            String headers = "HTTP/1.1 200 OK\r\n" +
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
        // Endpoint Root
        if (path.equals("/")) {
            String response = body;
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        } else
        // Endpoint /getbyname
        if (path.equals("/getbyname")) {
            String query = "";
            org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
            String searchValue = parsedBody.get("searchValue").toString();
            String filterValue = parsedBody.get("filterValue").toString();
            if (isNumeric(searchValue)) {
                query = "Select * from items where ItemID =" + searchValue;
            } else {
                query = "Select * from items where Item_Name like '%" + searchValue + "%' order by " + filterValue;
            }
            ResultSet rs = statement.executeQuery(query);
            String response = parseResultSet(rs).toString();
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        } else
        //Endpoint /sellitem
        if (path.equals("/sellitem")) {
            String query = "";
            org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
            String imageURL = parsedBody.get("imageURL").toString();
            String itemName = parsedBody.get("itemName").toString();
            String minimumBid = parsedBody.get("minimumBid").toString();
            String itemDescription = parsedBody.get("itemDescription").toString();
            String expireDate = parsedBody.get("expireDate").toString();
            String seller = parsedBody.get("username").toString();
             query = "INSERT INTO `items` (`Image_URL`,`Item_Name`,`Minimum_Bid`,`Item_Description`,`Seller`,`Expire_Date`) VALUES "+
                "('"+imageURL+"','"+itemName+"',"+minimumBid+",\""+itemDescription+"\",'"+seller+"','"+expireDate+"')";
             
            String response = Integer.toString(statement.executeUpdate(query));
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        } else
        // Endpoint /offerPage
        if (path.equals("/offerPage")) {
            if (!body.isEmpty() && isNumeric(body)) {
                ResultSet rs = statement.executeQuery("Select * from items where ItemID = " + body);
                String response = parseResultSet(rs).toString();
                String headers = "HTTP/1.1 200 OK\r\n" +
                        "Content-Type: application/json\r\n" +
                        "Access-Control-Allow-Origin: *\r\n" +
                        "Content-Length: " + response.length() + "\r\n" +
                        "\r\n";
                output.write(headers.getBytes());
                output.write(response.getBytes());
            } else
                sendNotFound(output);

        } else
        // Endpoint /uuidtousername
        if (path.equals("/uuidtousername")) {
            String response;
            if (!body.isEmpty()) {
                ResultSet rs = statement.executeQuery("Select Username from users where UserUUID = '" + body + "'");
                response = parseResultSet(rs).toString();
            } else
                response = "[{\"Username\":\"Nobody\"}]";
                System.out.println(response);
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());

        } else
        // Endpoint /login
        if (path.equals("/login")) {
            String query = "";
            org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
            String nameInput = parsedBody.get("nameInput").toString();
            String password = EncryptionUtils.encrypt(parsedBody.get("password").toString());
            if (isValidEmail(nameInput)) {
                query = "SELECT userUUID FROM users WHERE Email = '" + nameInput + "' AND Password = '" + password
                        + "';";
            } else {
                query = "SELECT userUUID FROM users WHERE Username = '" + nameInput + "' AND Password = '" + password
                        + "';";
            }
            ResultSet rs = statement.executeQuery(query);
            String response = parseResultSet(rs).toString();
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());

        } else
        // Endpoint /register
        if (path.equals("/register")) {
            org.json.simple.JSONObject parsedBody = JSONParse.parseStringToJson(body);
            String username = parsedBody.get("username").toString();
            String password =  EncryptionUtils.encrypt(parsedBody.get("password").toString());
            String birthDate = parsedBody.get("birthDate").toString();
            String email = parsedBody.get("email").toString();

            String insertquery = "INSERT INTO `Users` (`Username`, `Password`, `Birth_Date`, `Email`) VALUES" +
                    "('" + username + "', '" + password + "', '" + birthDate + "', '" + email + "');";
            int rs = statement.executeUpdate(insertquery);
            String response;
            if (rs > 0) {
                ResultSet res = statement.executeQuery(
                        "SELECT userUUID FROM users WHERE Email = '" + email + "' AND Password = '" + password + "';");
                response = parseResultSet(res).toString();
            } else
                response = "[]";
            String headers = "HTTP/1.1 200 OK\r\n" +
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
        ResultSetMetaData md = resultSet.getMetaData();
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
        while (resultSet.next()) {
            JSONObject row = new JSONObject();
            colNames.forEach(cn -> {
                try {
                    row.put(cn, resultSet.getObject(cn));
                } catch (JSONException | SQLException e) {
                    e.printStackTrace();
                }
            });
            result.put(row);
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