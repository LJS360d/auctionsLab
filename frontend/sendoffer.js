const itemID = new URL(location.href).searchParams.get('itemID');
const offerInput = new URL(location.href).searchParams.get('offerInput');
//Connect to MiddleMan (Proxy)
const socket = io('ws://localhost:9098');
await socket.send('newoffer', itemID, offerInput)
socket.on('newoffer', statusmsg => {
    let param = "orsb=1"
    if (statusmsg === "success") {
        param = "ogsb=1"
    }
    window.open('homepage.html?' + param, "_self")
    //setTimeout(()=>{window.open('homepage.html?'+param,"_self")},5000)
})