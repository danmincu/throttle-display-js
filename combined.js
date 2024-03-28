const net = require('net');
const port = 30001;

function generateRandomString() {
  return Math.random().toString(36).substring(2, 15);
}

const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data) => {
   // console.log('Received from client:', data.toString().trim());
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


// ----------------- CLIENT -----------------------------------------

const host = 'localhost';

const client = new net.Socket();

client.connect(port, host, () => {
  console.log(`Connected to server on ${host}:${port}`);
  client.setKeepAlive(true);
});

messageQueue = [];

client.on('data', (data) => {
  
  // don't display at the receipt cadence 
  // console.log('Received: ' + data.toString().replace('\n', ''));
  
  if (emptyFor5sec) {
    console.log(
      'Displaying message imediately:' + data.toString().replace('\n', '')
    );
    emptyFor5sec = false;
  } else messageQueue.push(data.toString().replace('\n', ''));
  // Send an ack message back to the server
  client.write(`ack ${data}\n`); // Make sure to add '\n' if the server uses it as a delimiter
});

client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error(`Connection error: ${err.message}`);
});

emptyFor5sec = true;

// Function to display a message from the queue every 5 seconds
function displayMessages() {
  setInterval(() => {
    if (messageQueue.length > 0) {
      emptyFor5sec = false;
      const message = messageQueue.shift(); // Remove the first message from the queue
      console.log('Displaying message every 5 seconds:', message);
    } else {
      // No messages in queue to display
      emptyFor5sec = true;
    }
  }, 5000); // 5000 milliseconds = 5 seconds
}

// Start displaying messages
displayMessages();

process.stdin.resume(); // This will keep the application running.


