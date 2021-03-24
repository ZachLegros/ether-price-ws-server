const axios = require("axios");
const PORT = 8080;
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ["GET"],
  },
});
require("dotenv").config();

io.on("connection", (socket) => {
  const start = Date.now();
  console.log("Socket connection established", socket.id);

  let lastEthPrice;

  socket.on("ping", (data) => {
    console.log("Latency: " + (Date.now() - start - data.elapsed) + "ms");
  });

  setInterval(() => {
    try {
      axios
        .get(
          `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.API_KEY}`
        )
        .then((response) => {
          if (response.status === 200) {
            if (response.data.result.ethusd !== lastEthPrice) {
              lastEthPrice = response.data.result.ethusd;
              socket.emit("data", {
                ethusd: lastEthPrice,
              });
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  }, 15000);
});

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
