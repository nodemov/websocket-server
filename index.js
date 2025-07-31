const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow React frontend & Laravel
    },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
    console.log("✅ New client connected");

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected");
    });
});

// Laravel จะยิง POST มาที่นี่เพื่อส่งข้อความ
app.post("/broadcast", (req, res) => {
    const { message } = req.body;
    io.emit("chat_message", message);
    res.json({ status: "sent" });
});

server.listen(80, () => {
    console.log("🟢 WebSocket server running on http://localhost:80");
});
