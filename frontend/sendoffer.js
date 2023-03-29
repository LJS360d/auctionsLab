import { showSnackbarGreenText,showSnackbarRedText } from "./modules/snackbarManager.js";

const itemID = new URL(location.href).searchParams.get('itemID');
const offerInput = new URL(location.href).searchParams.get('offerInput');
//Connect to MiddleMan (Proxy)
const socket = io('ws://localhost:9098');
await socket.send('newoffer',itemID,offerInput).then(()=>{
    window.open('index.html',"_self")
    setTimeout(showSnackbarGreenText('Offer Made!'),2500)
},()=>{
    window.open("index.html","_self")
    setTimeout(showSnackbarRedText('Something went wrong...'),2500)

})