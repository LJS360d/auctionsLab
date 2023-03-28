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
            System.out.println(">Connecting to Database...");
            sqlConnection = DriverManager.getConnection(DB_URL, USER, PASS);
            System.out.println(">Connection with " + DB_URL + " Established");
            statement = sqlConnection.createStatement();
            System.out.println(">Initialized SQL Statement");
            amogus();
            new UDPServer(MULTICAST_PORT);
            new TCPServer(PORT, sqlConnection);
        }catch (Exception e){
            e.printStackTrace();
        }
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

    

}
