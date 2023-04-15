import * as APIService from "./modules/APIService.js"
import { isValidUUID } from "./modules/utils/isValidUUID.js";
import { showSnackbarRedText } from "./modules/managers/snackbarManager.js";
import { isValidEmail } from "./modules/utils/isValidEmail.js";
const params = new URL(location.href).searchParams;
//Security Improvement: Send hashed password instead
sessionStorage.clear();

if (params.has('nameInput') && params.has('password')) {
    await loginRequest(params.get('nameInput'), params.get('password'))
} else {
    const uuid = localStorage.getItem('uuid');
    const username = localStorage.getItem('username')
    if (uuid && username) {
        if (validateLogin(uuid, username, params.get('remember'))) {
            window.open('homepage.html', '_self')
        } else
            showSnackbarRedText("Wrong Login Information");
    }
}

async function loginRequest(nameInput, password) {
    const authData = { nameInput: nameInput, password: password }
    const res = JSON.parse(await APIService.post(JSON.stringify(authData), "/login"))[0]
    let uuid = res ? res.UserUUID : '';
    const username = isValidEmail(authData.nameInput) ? await getUsernameFromEmail(authData.nameInput) : authData.nameInput;
    if (validateLogin(uuid, username, params.get('remember'))) {
        window.open('homepage.html', '_self')
    } else
        showSnackbarRedText("Wrong Login Information");
}


function validateLogin(uuid, username, remember) {
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

async function getUsernameFromEmail(email) {
    return JSON.parse(await APIService.post(email, '/emailtousername'))[0].Username;
}
