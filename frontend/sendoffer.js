const params = new URL(location.href).searchParams;
const itemID = params.get('itemID');
const offerInput = params.get('offerInput');
const uuid = localStorage.getItem('uuid') ?? sessionStorage.getItem('uuid') ?? false;
const minOffer = Number(params.get('minOffer'));
//Connect to MiddleMan (Proxy)
const socket = io('ws://localhost:9098');
if (offerInput <= minOffer) {
    window.open("homepage.html?rsb=2", "_self")
}
if(params.has('itemID') && params.has('offerInput') && uuid){
    await socket.send('newoffer', itemID, offerInput, uuid)
}
socket.on('newoffer', statusmsg => {
    let param = "rsb=1"
    if (statusmsg === "success") {
        param = "gsb=1"
    }
    window.open('homepage.html?' + param, "_self")
})