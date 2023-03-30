//Extract data off URL
//POST /login {"Username":"Luciano","Password":"Puppa","BirthDate":"1958-04-09","Email":"lucianocarlotti58@gmail.com"} 
import * as APIService from "./modules/APIService.js"
import { showSnackbarRedText } from "./modules/snackbarManager.js";
const params = new URL(location.href).searchParams;

//Is this Unsafe?
const authData = { nameInput: params.get('nameInput'), password: params.get('password') }

//validateLogin("valid", authData.nameInput, params.get('remember'))
validateLogin(await APIService.post(JSON.stringify(authData), "/login"), authData.nameInput, params.get('remember'))

/**
 * Check if the login data provided is valid
 * 
 * @param {String} uuid API response at POST /login {data}
 * @param {Object} username {nameInput:"Luciano",password:"changeme"}
 * @param {String} remember if "on" memorize in localStorage instead of session storage
 */
function validateLogin(uuid, username, remember) {
    if (uuid === "invalid") {
        showSnackbarRedText("Login Information Invalid");
        return false;
    } else {
        if (remember !== "on") {
            sessionStorage.setItem('username', username)
            sessionStorage.setItem('uuid', uuid)
        } else {
            localStorage.setItem('username', username)
            localStorage.setItem('uuid', uuid)
        }
        window.open('/homepage.html', "_self")
    }
}


