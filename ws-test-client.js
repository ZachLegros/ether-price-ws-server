const io = require("socket.io-client");

const socket = io("ws://localhost:8080", {
  reconnectionDelayMax: 10000,
});

socket.on("connect", () => {
  const start = Date.now();

  // ping server
  setInterval(() => {
    // volatile, so the packet will be discarded if the socket is not connected
    socket.volatile.emit("ping", {
      elapsed: Date.now() - start,
    });
  }, 10000);
});

socket.on("data", (data) => {
  console.log(data);
});
