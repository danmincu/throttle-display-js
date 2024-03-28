const net = require('net');
const port = 30001;

function generateRandomString() {
  return Math.random().toString(36).substring(2, 15);
}

const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data) => {
    console.log('Received from client:', data.toString().trim());
  });

  let isConnected = true;
  socket.on('end', () => {
    isConnected = false;
    console.log('Client disconnected.');
  });

  function sendRandomString() {
    if (!isConnected) {
      return;
    }
    const randomString = generateRandomString();
    //console.log(`Sending: ${randomString}`);
    socket.write(randomString + '\n');

    let nextSendIn = Math.floor(Math.random() * (3000 - 200 + 1)) + 200;
    setTimeout(sendRandomString, nextSendIn);
  }

  sendRandomString();
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});