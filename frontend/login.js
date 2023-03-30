import * as APIService from "./modules/APIService.js"
import { showSnackbarRedText } from "./modules/snackbarManager.js";
const params = new URL(location.href).searchParams;
//Is this Unsafe?
const authData = { nameInput: params.get('nameInput'), password: params.get('password') }
if(params.has('nameInput') && params.has('password')){
    if(validateLogin(await APIService.post(JSON.stringify(authData), "/login"), authData.nameInput, params.get('remember'))) {
        showSnackbarRedText("Something went wrong...");
    }else
    window.open('/homepage.html', "_self")

}

/**
 * Check if the login data provided is valid
 * @param {String} uuid API response at POST /login {data}
 * @param {Object} username {nameInput:"Luciano",password:"changeme"}
 * @param {String} remember if value == `"on"` memorize in localStorage instead of session storage
 */
function validateLogin(uuid, username, remember) {
    if (uuid === "invalid") {
        return false;
    } else {
        if (remember !== "on") {
            sessionStorage.setItem('username', username)
            sessionStorage.setItem('uuid', uuid)
        } else {
            localStorage.setItem('username', username)
            localStorage.setItem('uuid', uuid)
        }
        return true;
    }
}


