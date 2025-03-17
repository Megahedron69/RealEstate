// import { WebSocketServer, WebSocket } from "ws";
// import {
//   createChatService,
//   sendMessageService,
//   getMessagesService,
//   getUserChatsService,
//   getChatByUsersService,
// } from "./services/chat.service";

// const wss = new WebSocketServer({ port: 3002 });

// interface CustomWebSocket extends WebSocket {
//   userId?: string;
// }

// const clients = new Map<string, CustomWebSocket>(); // Store connected users

// wss.on("connection", async (ws: CustomWebSocket, req:Request) => {
//   const url = new URL(req.url ?? "", `http://${req.headers.host}`);
//   const userId = url.searchParams.get("userId");

//   if (!userId) {
//     ws.close(1008, "Unauthorized - userId is required");
//     return;
//   }

//   console.log(`🔗 User Connected: ${userId}`);
//   ws.userId = userId;
//   clients.set(userId, ws);

//   try {
//     // Fetch all user chats with previous messages
//     const userChats = await getUserChatsService(userId);

//     for (const chat of userChats) {
//       const messages = await getMessagesService(chat.id);
//       ws.send(
//         JSON.stringify({ type: "previousMessages", chatId: chat.id, messages })
//       );
//     }
//   } catch (error) {
//     console.error("❌ Error fetching previous messages:", error);
//   }

//   ws.on("message", async (data) => {
//     try {
//       const { type, receiverId, message } = JSON.parse(data.toString());

//       if (!receiverId || !message) {
//         ws.send(
//           JSON.stringify({ type: "error", message: "Invalid message data." })
//         );
//         return;
//       }

//       if (type === "sendMessage") {
//         // Check if chat exists or create new chat
//         let chat = await getChatByUsersService(userId, receiverId);
//         if (!chat) {
//           chat = await createChatService(userId, receiverId);
//         }

//         // Store message in DB
//         const newMessage = await sendMessageService(chat.id, userId, message);

//         // Send message to sender
//         ws.send(JSON.stringify({ type: "messageSent", data: newMessage }));

//         // Send message to receiver if online
//         const receiverSocket = clients.get(receiverId);
//         if (receiverSocket) {
//           receiverSocket.send(
//             JSON.stringify({ type: "newMessage", data: newMessage })
//           );
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error processing message:", error);
//       ws.send(
//         JSON.stringify({ type: "error", message: "Message processing failed." })
//       );
//     }
//   });

//   ws.on("close", () => {
//     console.log(`❌ User Disconnected: ${userId}`);
//     clients.delete(userId);
//   });
// });

// console.log("🚀 WebSocket server running on ws://localhost:3002");
