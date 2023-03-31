import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
public class JSONParse {
    public static JSONObject parseStringToJson(String jsonString) throws ParseException {
        return (JSONObject) new JSONParser().parse(jsonString);
    }
    public boolean ViewEmailOrUsername(JSONObject object,Statement stats)
    {
        Final String invalid="ivalid";
        boolean verifica=false;
        String nameInput = (String)object.get("nameInput");
        String password = (String)object.get("password");
        char[] chars = new char[nameInput.length()];
        for(int c=0;chars.length();c++)
        ResultSet rs1 = stats.executeQuery("Select * From Users where Username="+"'"+nameInput+"'"+" and "+"password="+"'"+password+"'");
        {
            if(chars[c]==@);
            while(rs1.next()){
                String pas = rs1.getString("password");
                if(pas==password)
                {
                    verifica=true;
                }
            }
        }else {
            while(rs1.next()){
                String use = rs1.getString("Username");
                if(use==nameInput)
                {
                    verifica=true;
                }
            }
        }
        if(verifica==true)
        {
            return rs1.getString("UserUUID");

        }else return invalid;
    } 
}
