import java.io.*;
import java.net.*;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.json.*;;

public class AuctionsLabHttpServer {
    final static String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    final static String DATABASE = "auctions";
    final static String DB_URL = "jdbc:mysql://localhost:3306/" + DATABASE;
    final static String USER = "root";
    final static String PASS = "RISOSCOTTI";
    final static int PORT = 9090;
    static Connection sqlConnection = null;
    static Statement statement = null;

    public static void main(String[] args) throws Exception {
        try (ServerSocket serverSocket = new ServerSocket(PORT);) {
            amogus();
            System.out.println("Connecting to Database...");
            sqlConnection = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println("Connection with " + DB_URL + " Established");
            statement = sqlConnection.createStatement();
            System.out.println("Initialized SQL Statement");
            System.out.println("Server started at localhost:" + PORT);
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("Accepted connection from " + clientSocket.getInetAddress());
                // Runnable as Lambda
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
        if (path.equals("/")) {
            ResultSet rs = statement.executeQuery("Select * from items");
            String response = "{\"message\": \"" + parseResultSet(rs).toString() + "\"}";
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        }

        else {
            sendNotFound(output);
        }
    }

    private static void handlePost(String path, String body, OutputStream output) throws Exception {
        if (path.equals("/")) {
            String response = "{\"message\": \"" + body + "\"}";
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        } else if (path.equals("/getbyname")) {
            String query = "";
            if(isNumeric(body)){
                query = "Select * from items where ItemID ="+body;
            }else{
                query = "Select * from items where Item_Name like '%"+body+"%'";
            }
            ResultSet rs = statement.executeQuery(query);
            String response = "{\"message\": \"" + parseResultSet(rs).toString() + "\"}";
            String headers = "HTTP/1.1 200 OK\r\n" +
                    "Content-Type: application/json\r\n" +
                    "Access-Control-Allow-Origin: *\r\n" +
                    "Content-Length: " + response.length() + "\r\n" +
                    "\r\n";
            output.write(headers.getBytes());
            output.write(response.getBytes());
        } else if (path.equals("/offerPage")) {
            if (!body.isEmpty()) {
                ResultSet rs = statement.executeQuery("Select * from items where ItemID = " + body);
                String response = "{\"message\": \"" + parseResultSet(rs).toString() + "\"}";
                String headers = "HTTP/1.1 200 OK\r\n" +
                        "Content-Type: application/json\r\n" +
                        "Access-Control-Allow-Origin: *\r\n" +
                        "Content-Length: " + response.length() + "\r\n" +
                        "\r\n";
                output.write(headers.getBytes());
                output.write(response.getBytes());
            } else {
                sendNotFound(output);
            }
        } else {
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

    private static void amogus() {
        System.out.println("-----------------⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⡀---------");
        System.out.println("-------------⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤--------");
        System.out.println("-------------⣼⣿⠋-------⢀⣀⣀⠈⢻⣿⣿⡄------");
        System.out.println("------------⣸⣿⡏---⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄-----");
        System.out.println("------------⣿⣿⠁--⢰⣿⣿⣯⠁-------⠈⠙⢿⣷⡄---");
        System.out.println("------⣀⣤⣴⣶⣶⣿⡟---⢸⣿⣿⣿⣆----------⣿⣷----");
        System.out.println("-----⢰⣿⡟⠋⠉⣹⣿⡇---⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿??----");
        System.out.println("-----⢸⣿⡇--⣿⣿⡇----⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿??----");
        System.out.println("-----⣸⣿⡇--⣿⣿⡇-----⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻???----");
        System.out.println("-----⣿⣿⠁--⣿⣿⡇-----------------⢸⣿⣧----");
        System.out.println("-----⣿⣿---⣿⣿⡇-----------------⢸⣿⣿----");
        System.out.println("-----⣿⣿---⣿⣿⡇-----------------⢸⣿⣿----");
        System.out.println("-----⢿⣿⡆--⣿⣿⡇-----------------⢸⣿⡇----");
        System.out.println("-----⠸⣿⣧⡀-⣿⣿⡇-----------------⣿⣿⠃----");
        System.out.println("------⠛⢿⣿⣿⣿⣿⣇-----⣰⣿⣿⣷⣶⣶⣶⣶⢠⣿⣿????----");
        System.out.println("------------⣿⣿------⣿⣿⡇-⣽⣿⡏--⢸⣿?-----");
        System.out.println("------------⣿⣿------⣿⣿⡇-⢹⣿⡆---⣸⣿⠇----");
        System.out.println("------------⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁--⠻⣿⣿⣿⣿⡿??-----");
        System.out.println("------------⠈⠛⠻⠿⠿⠿⠿⠋⠁----------------");

    }

    public static boolean isNumeric(String strNum) {
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
    
}
