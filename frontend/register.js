//Get url params and send to Backend for registration 
//POST /register {"Username":"Luciano","Password":"Puppa","BirthDate":"1958-04-09","Email":"lucianocarlotti58@gmail.com"} 
import * as APIService from "./modules/APIService.js"
import { isValidUUID } from "./modules/utils/isValidUUID.js";
import { showSnackbarRedText } from "./modules/managers/snackbarManager.js";
const params = new URL(location.href).searchParams;
//Is this Unsafe?
const regData = {
    username: params.get('username'),
    password: params.get('password'),
    birthDate: params.get('dateOfBirth'),
    email: params.get('email')
}
//TODO:send hashed password
if (params.has('username') && params.has('password') && params.has('dateOfBirth') && params.has('email')) {
    const res = JSON.parse(await APIService.post(JSON.stringify(regData), "/register"))[0]
    let uuid = res ? res.UserUUID : '';
    if (isRegistrationSuccess(uuid, regData.username, params.get('remember'))) {
        window.open('/homepage.html', "_self")
    } else showSnackbarRedText("Could not register");
}

function isRegistrationSuccess(uuid, username, remember) {
    if (!isValidUUID(uuid) || uuid === '') {
        return false;
    } else {
        if (remember !== "on") {
            sessionStorage.setItem('username', username)
            sessionStorage.setItem('uuid', uuid)
            localStorage.removeItem('username')
            localStorage.removeItem('uuid')
        } else {
            localStorage.setItem('username', username)
            localStorage.setItem('uuid', uuid)
        }
        return true;
    }
}