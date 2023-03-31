import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class JSONParse {
    public static JSONObject parseStringToJson(String jsonString) throws ParseException {
        return (JSONObject) new JSONParser().parse(jsonString);
    }
}