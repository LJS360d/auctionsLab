import java.net.*;
import java.sql.*;

public class UDPServer {
    static MulticastSocket multicastSocket = null;
    static Statement statement = null;

    @SuppressWarnings("deprecation")
    public UDPServer(int port, Statement sqlStatement) throws Exception {
        multicastSocket = new MulticastSocket(port);
        statement = sqlStatement;
        multicastSocket.setOption(StandardSocketOptions.IP_MULTICAST_LOOP, false);
        System.out.println(">UDP Server started at localhost:" + port + ",Multicast loopback "
                + (multicastSocket.getOption(StandardSocketOptions.IP_MULTICAST_LOOP) ? "Enabled" : "Disabled")+"\n");
        new Thread(() -> {
            try {
                multicastSocket.joinGroup(InetAddress.getByName("224.0.0.1"));
                byte[] buffer = new byte[1024];

                while (true) {
                    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

                    multicastSocket.receive(packet);

                    String message = new String(packet.getData(), 0, packet.getLength());
                    System.out.println("Received message: " + message + " from " + packet.getAddress()
                            + ":" + packet.getPort());

                    String response = "Hello, client!";
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
}
