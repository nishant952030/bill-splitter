const socketIo = require('socket.io');

let io; // This will store the Socket.IO instance
const connectedSockets = new Map();

function initializeSocket(httpServer) {
    io = socketIo(httpServer, {
        cors: {
            origin: "https://bill-splitter-zeta.vercel.app",
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        },
        ackTimeout: 10000
    });

    io.on('connection', (socket) => {
        console.log(`User connected:`, socket.id);

        socket.on('registerUser', (userId) => {
            connectedSockets.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ID: ${socket.id}`);
        });

        socket.on('new-expense', (newExpense, ackCallback) => {      
            const receiverSocketId = connectedSockets.get(newExpense.createdWith[0]._id);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new-expense', newExpense);

                if (typeof ackCallback === 'function') {
                    ackCallback(newExpense);
                }
            } else {
                console.log(`No socket connected for user with ID: ${newExpense.createdWith[0]._id}`);
            }
        });
        
        socket.on("update-settled", (message, ackCallback) => {
            const receiverSocketId = connectedSockets.get(message.createdBy);
            io.to(receiverSocketId).emit("update-settled", message);
            if (typeof ackCallback === 'function') {
                ackCallback(message);
            }
        })
        socket.on("update-reciever-confirm", (message, ackCallback) => {
            const receiverSocketId=connectedSockets.get(message.createdWith[0]);
            io.to(receiverSocketId).emit("update-reciever-confirm", message);
            if (typeof ackCallback === 'function') {
                ackCallback(message);
            }
        })
        socket.on("update-count", (message) => {
            const receiverSocketId1 = connectedSockets.get(message.createdWith[0]);
            const receiverSocketId2 = connectedSockets.get(message.createdBy);
            io.to(receiverSocketId1).emit("update-count", message);
            io.to(receiverSocketId2).emit("update-count", message);

        }) 

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            for (let [userId, socketId] of connectedSockets.entries()) {
                if (socketId === socket.id) {
                    connectedSockets.delete(userId);
                    break;
                }
            }
        });
    });
}

module.exports = {
    initializeSocket,
    getIo: () => io,
    connectedSockets
};
