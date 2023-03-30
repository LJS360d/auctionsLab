//Get url params and send to Backend for registration 
//POST /register {"Username":"Luciano","Password":"Puppa","BirthDate":"1958-04-09","Email":"lucianocarlotti58@gmail.com"} 
import * as APIService from "./modules/APIService.js"
import { showSnackbarRedText } from "./modules/snackbarManager.js";
const params = new URL(location.href).searchParams;
//Is this Unsafe?
const regData = {
    username: params.get('username'),
    password: params.get('password'),
    birthDate: params.get('date-of-birth'),
    email: params.get('email')
}

if (params.values.length === 5 && params.has('username') && params.has('password') && params.has('date-of-birth') && params.has('email')){
    isRegistrationSuccess(await APIService.post(JSON.stringify(regData), "/register"), authData.nameInput, params.get('remember')) ?
    window.open('/homepage.html', "_self"):showSnackbarRedText("Could not register");

}

function isRegistrationSuccess(uuid, username, remember) {
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


