const params = new URL(location.href).searchParams;
const itemID = params.get('itemID');
const offerInput = params.get('offerInput');
const uuid = localStorage.getItem('uuid') ?? sessionStorage.getItem('uuid');
const minOffer = params.get('minOffer');
//Connect to MiddleMan (Proxy)
const socket = io('ws://localhost:9098');
if (offerInput < minOffer) {
    window.open('offer.html?itemID=' + itemID + "&orsb=2", "_self")
}
await socket.send('newoffer', itemID, offerInput, uuid)
socket.on('newoffer', statusmsg => {
    let param = "orsb=1"
    if (statusmsg === "success") {
        param = "ogsb=1"
    }
    window.open('homepage.html?' + param, "_self")
    //setTimeout(() => { window.open('homepage.html?' + param, "_self") }, 5000)
})