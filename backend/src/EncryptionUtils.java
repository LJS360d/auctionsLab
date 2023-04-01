import javax.crypto.*;
import javax.crypto.spec.*;
import java.util.Base64;

public class EncryptionUtils {
    private static final String ENCRYPTION_KEY = "eHx7G9Abg5vK3qWJtPuZpFmDcNyr02LS";

    public static String encrypt(String plaintext) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] encrypted = cipher.doFinal(plaintext.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public static String decrypt(String ciphertext) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(ENCRYPTION_KEY.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        byte[] decoded = Base64.getDecoder().decode(ciphertext);
        byte[] decrypted = cipher.doFinal(decoded);
        return new String(decrypted);
    }
}
