import { showSnackbarGreenText, showSnackbarRedText } from "./modules/managers/snackbarManager.js";

const itemID = new URL(location.href).searchParams.get('itemID');
const offerInput = new URL(location.href).searchParams.get('offerInput');
//Connect to MiddleMan (Proxy)
const socket = io('ws://localhost:9098');
await socket.send('newoffer', itemID, offerInput)
socket.on('newoffer', statusmsg => {
    //TODO:Change snackbar method, timeout no worka
    if (statusmsg === "success") {
        setTimeout(showSnackbarGreenText('Offer Made!'), 2500)
    } else {
        setTimeout(showSnackbarRedText('Something went wrong...'), 2500)
    }
    window.open('homepage.html', "_self")

})