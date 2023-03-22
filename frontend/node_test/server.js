const sqlconnection = require('mysql').createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RISOSCOTTI',
  database: 'auctions'
});
sqlconnection.connect()
const http = require('http').createServer();
const io = require('socket.io')(http, { cors: { origin: "*" } });
http.listen(8080, () => console.log(`listening on port ${http.address().port}`))
io.on('connection', (socket) => {
  console.log(`User connected! ID:${socket.id}`)
  
  socket.on('message', (message, query) => {
    if (message == 'query') {
      if (query.match(/drop |create |.drop |.create |.insert |insert |.trigger |trigger /gim) == null) {

        sqlconnection.query(query, (error, results) => {
          if (error) socket.emit('error', error.message);
          if (!error)
            for (const row of results) {
              socket.emit('results', row);
            }
        })
      } else { socket.emit('results', 'ER_FORBIDDEN:You do not have permission to execute that command.') }
    }
  })
})