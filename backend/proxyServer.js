const http = require('http').createServer();
const socketUDP = require('dgram').createSocket('udp4');
const socketTCP = require('socket.io')(http, { cors: { origin: "*" } });
http.listen(9098, () => console.log(`>TCP MiddleMan listening on localhost:${http.address().port}`))
socketUDP.bind(9099, () => {socketUDP.addMembership('224.0.0.1')})
socketUDP.on('listening', () => console.log(`>UDP middleMan listening on localhost:${socketUDP.address().port}`));

socketTCP.on('connection', (socket) => {
    console.log("TCP>Accepted Handshake from client");
    socket.on('message', (message, ...args) => {
        if (message == "newoffer") {
            const itemID = args[0];
            const offerAmount = args[1];

            const message = `{"itemID":${itemID},"offerAmount":${offerAmount}}`;
            const buffer = Buffer.from(message);
            const port = 9097;
            const host = '224.0.0.1';
            console.log("Sending UDP buffer:" + message + " to " + host + ":" + port);
            socketUDP.send(buffer, port, host);
        }
    })
})

socketUDP.on('message', (msg, rinfo) => {
    console.log(`Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
    console.log(`Data: ${msg.toString()}`);
    socketTCP.emit('newoffer',msg.toString())
});