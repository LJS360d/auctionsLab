import java.io.IOException;
import java.net.*;
import java.sql.*;
import org.json.simple.JSONObject;

public class UDPServer{
    static MulticastSocket multicastSocket = null;
    static Statement statement = null;
    static InetAddress proxyAddr = null;
    static int proxyPort;

    @SuppressWarnings("deprecation")
    public UDPServer(int port, Statement sqlStatement) throws Exception {
        multicastSocket = new MulticastSocket(port);
        statement = sqlStatement;
        // multicastSocket.setOption(StandardSocketOptions.IP_MULTICAST_LOOP, false);
        System.out.println(">UDP Server started at localhost:" + port + ",Multicast loopback "
                + (multicastSocket.getOption(StandardSocketOptions.IP_MULTICAST_LOOP) ? "Enabled" : "Disabled") + "\n");
        new Thread(() -> {
            try {
                multicastSocket.joinGroup(InetAddress.getByName("224.0.0.1"));
                byte[] buffer = new byte[1024];
                proxyAddr = InetAddress.getLocalHost();
                proxyPort = 9099;
                while (true) {
                    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                    multicastSocket.receive(packet);
                    String message = new String(packet.getData(), 0, packet.getLength());
                    System.out.println("UDP>Received message: " + message + " from " + packet.getAddress()
                            + ":" + packet.getPort());

                    JSONObject parsedRequest = JSONParse.parseStringToJson(message);

                    String response = handleNewOffer(parsedRequest);
                    proxyAddr = packet.getAddress();
                    proxyPort = packet.getPort();
                    byte[] responseBytes = response.getBytes();
                    DatagramPacket responsePacket = new DatagramPacket(responseBytes, responseBytes.length,
                            packet.getAddress(), packet.getPort());
                    multicastSocket.send(responsePacket);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();

    }

    private static String handleNewOffer(JSONObject parsedMessage) throws SQLException {
        String offerAmount = parsedMessage.get("offerAmount").toString();
        String itemID = parsedMessage.get("itemID").toString();
        String uuid = parsedMessage.get("uuid").toString();
        String query = "UPDATE `items` SET `Current_bid` = " + offerAmount + ", `Highest_Bidder` = '" + uuid
                + "' WHERE `itemID` = " + itemID;
        int numRowsUpdated = statement.executeUpdate(query);
        return (numRowsUpdated == 1) ? "success" : "fail";
    }

    public static void shutdownProxy() {
        byte[] shutdownMsg = "shutdown".getBytes();
        DatagramPacket shutdown = new DatagramPacket(shutdownMsg, shutdownMsg.length, proxyAddr, proxyPort);
        try {
            multicastSocket.send(shutdown);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    
}
