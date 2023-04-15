const fp = "proxy.log"
const fs = require('fs'); log(`Proxy Started - ${new Date().toLocaleString('it-IT')}`)
const http = require('http').createServer();
const socketUDP = require('dgram').createSocket('udp4');
const socketTCP = require('socket.io')(http, { cors: { origin: "*" } });
http.listen(9098, () => log(`>TCP MiddleMan listening on localhost:${http.address().port}`))
socketUDP.bind(9099, () => { socketUDP.addMembership('224.0.0.1') })
socketUDP.on('listening', () => log(`>UDP middleMan listening on localhost:${socketUDP.address().port}`));
//TCP Receiver
socketTCP.on('connection', (socket) => {
    log("TCP>Accepted Handshake from client");
    socket.on('message', (msg, ...args) => {
        if (msg == "newoffer") {
            const itemID = args[0];
            const offerAmount = args[1];
            const uuid = args[2];
            const message = `{"itemID":${itemID},"offerAmount":${offerAmount},"uuid":"${uuid}"}`;
            const buffer = Buffer.from(message);
            const port = 9097;
            const host = '224.0.0.1';
            log("Sending UDP buffer:" + message + " to " + host + ":" + port);
            socketUDP.send(buffer, port, host);
        }
    })
})
//UDP Receiver
socketUDP.on('message', (msg, remoteInfo) => {

    log(`Received ${msg.length} bytes from ${remoteInfo.address}:${remoteInfo.port}`);
    log(`Payload: ${msg.toString()}`);
    socketTCP.emit('newoffer', msg.toString())

    if (msg == 'shutdown') {
        log(`Shutting down proxy server - ${new Date().toLocaleString('it-IT')}`)
        socketTCP.close()
        socketUDP.close()
    }
});
function log(string) {
    fs.appendFileSync(fp, string + "\n")
}