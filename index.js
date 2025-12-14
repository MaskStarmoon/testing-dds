const express = require("express");
const DDSJoinPing = require('./join');

const app = express();
const PORT = 3000;

// start ping otomatis tiap 2 detik saat server nyala
const pingId = DDSJoinPing.startPing(2000);

app.get("/", (req, res) => {
    res.send("Server aktif & ping berjalan");
});

// optional: endpoint untuk stop ping
app.get("/stop-ping", (req, res) => {
    DDSJoinPing.stopPing(pingId);
    res.send("Ping dihentikan");
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
