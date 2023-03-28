import java.net.DatagramPacket;
import java.net.InetAddress;
import java.net.MulticastSocket;
@SuppressWarnings("deprecation")
public class UDPServer {
    MulticastSocket multicastSocket = null;
    public UDPServer(int port) throws Exception{
        multicastSocket = new MulticastSocket(port);
        //multicastSocket.setLoopbackMode(true);
        System.out.println(">" + (multicastSocket.getLoopbackMode() ? "Multicast loopback Disabled": "Multicast lopback Enabled"));
        System.out.println("UDP Server started at localhost:" + port);
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
