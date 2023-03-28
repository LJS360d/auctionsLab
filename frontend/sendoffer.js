import * as APIService from "./modules/APIService.js";

const itemID = new URL(location.href).searchParams.get('itemID');
const offerInput = new URL(location.href).searchParams.get('offerInput');
console.log(await APIService.post(JSON.stringify({itemID:itemID,offerInput:offerInput})));