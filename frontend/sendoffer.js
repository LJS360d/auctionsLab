import * as APIService from "./modules/APIService.js";

const itemID = new URL(location.href).searchParams.get('itemID');
const offerInput = new URL(location.href).searchParams.get('offerInput');
//if true (window.open("index.html","_self") with success snackbar)
//if false (window.open("index.html","_self") with fail snackbar)
console.log(await APIService.post(JSON.stringify({itemID:itemID,offerInput:offerInput})));