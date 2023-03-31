import java.io.*;
import java.sql.*;

public class AuctionsLabHttpServer {
    final static String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    final static String DATABASE = "auctions";
    final static String DB_URL = "jdbc:mysql://localhost:3306/" + DATABASE;
    final static String USER = "root";
    final static String PASS = "RISOSCOTTI";
    final static int PORT = 9090;
    final static int MULTICAST_PORT = 9097;
    static Connection sqlConnection = null;
    static Statement statement = null;

    public static void main(String[] args) throws Exception {
        try {

            System.out.println("-Connecting to Database...");
            sqlConnection = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println(">Connection with " + DB_URL + " Established\n");

            System.out.println("-Initializing SQL Statement...");
            statement = sqlConnection.createStatement();
            System.out.println(">SQL Statement Initialized\n");

            System.out.println("-Starting Node.JS Proxy...");
            runProxy();
            System.out.println(">Proxy Server Started, Check Logs at ./proxy.log\n");

            System.out.println("-Starting UDP Handler...");
            new UDPServer(MULTICAST_PORT, statement);

            System.out.println("-Starting TCP Handler...");
            new TCPServer(PORT, statement);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void runProxy() {
        new Thread(() -> {
            try {
                // String[] command = {"cmd.exe", "/c", "code", "--reuse-window",
                // "--new-terminal", "--wait", "--command", "node middleMan.js"};
                String[] command = { "cmd.exe", "/c", "start", "/B", "cmd.exe", "/k", "node", "proxyServer.js" };
                ProcessBuilder pb = new ProcessBuilder(command);

                Process process = pb.start();
                System.out.println(">Proxy Server ProcessID:" + process.pid());
                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    System.out.println(">Killing Proxy Server");
                    System.out.println(process.destroyForcibly());
                }));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }).start();
    }
    /*
     * private static void amogus() {
     * System.out.println("-----------------⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⡀---------");
     * System.out.println("-------------⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤--------");
     * System.out.println("-------------⣼⣿⠋-------⢀⣀⣀⠈⢻⣿⣿⡄------");
     * System.out.println("------------⣸⣿⡏---⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄-----");
     * System.out.println("------------⣿⣿⠁--⢰⣿⣿⣯⠁-------⠈⠙⢿⣷⡄---");
     * System.out.println("------⣀⣤⣴⣶⣶⣿⡟---⢸⣿⣿⣿⣆----------⣿⣷----");
     * System.out.println("-----⢰⣿⡟⠋⠉⣹⣿⡇---⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿??----");
     * System.out.println("-----⢸⣿⡇--⣿⣿⡇----⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿??----");
     * System.out.println("-----⣸⣿⡇--⣿⣿⡇-----⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻???----");
     * System.out.println("-----⣿⣿⠁--⣿⣿⡇-----------------⢸⣿⣧----");
     * System.out.println("-----⣿⣿---⣿⣿⡇-----------------⢸⣿⣿----");
     * System.out.println("-----⣿⣿---⣿⣿⡇-----------------⢸⣿⣿----");
     * System.out.println("-----⢿⣿⡆--⣿⣿⡇-----------------⢸⣿⡇----");
     * System.out.println("-----⠸⣿⣧⡀-⣿⣿⡇-----------------⣿⣿⠃----");
     * System.out.println("------⠛⢿⣿⣿⣿⣿⣇-----⣰⣿⣿⣷⣶⣶⣶⣶⢠⣿⣿????----");
     * System.out.println("------------⣿⣿------⣿⣿⡇-⣽⣿⡏--⢸⣿?-----");
     * System.out.println("------------⣿⣿------⣿⣿⡇-⢹⣿⡆---⣸⣿⠇----");
     * System.out.println("------------⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁--⠻⣿⣿⣿⣿⡿??-----");
     * System.out.println("------------⠈⠛⠻⠿⠿⠿⠿⠋⠁----------------");
     * 
     * }
     */
}
