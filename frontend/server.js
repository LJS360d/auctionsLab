const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const message = 'Hello, server!';

const buffer = Buffer.from(message);

const port = 9097;
const host = '224.0.0.1';
client.send(buffer, port, host, (err) => {
    if (err) {
        console.log('Error sending message:', err);
    } else {
        console.log('Message sent to server');
    }

    client.close();
});
