import prisma from "../config/prisma";
import { ApiError } from "../middlewares/errorMiddleware";

const createChatService = async (user1Id: string, user2Id: string) => {
  try {
    if (user1Id === user2Id) {
      throw new ApiError(400, "You cannot create a chat with yourself.");
    }

    const userExists = await prisma.user.findMany({
      where: { id: { in: [user1Id, user2Id] } },
    });

    if (userExists.length !== 2) {
      throw new ApiError(404, "One or both users do not exist.");
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });

    return (
      existingChat ??
      (await prisma.chat.create({
        data: { user1Id, user2Id },
      }))
    );
  } catch (error: any) {
    throw new ApiError(500, "Error creating chat", [{ reason: error.message }]);
  }
};

const sendMessageService = async (
  chatId: string,
  senderId: string,
  content: string
) => {
  try {
    const chatExists = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chatExists) {
      throw new ApiError(404, "Chat does not exist.");
    }
    return await prisma.message.create({
      data: { chatId, senderId, content },
    });
  } catch (error: any) {
    throw new ApiError(500, "Error sending message", [
      { reason: error.message },
    ]);
  }
};

const getMessagesService = async (chatId: string) => {
  try {
    return await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
  } catch (error: any) {
    throw new ApiError(500, "Error retrieving messages", [
      { reason: error.message },
    ]);
  }
};

const getUserChatsService = async (userId: string) => {
  try {
    return await prisma.chat.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        user1: { select: { id: true, username: true } },
        user2: { select: { id: true, username: true } },
      },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to fetch user's chats", [
      { reason: error.message },
    ]);
  }
};

const getChatByUsersService = async (user1Id: string, user2Id: string) => {
  try {
    return await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });
  } catch (error: any) {
    throw new ApiError(500, "Failed to fetch chat between users", [
      { reason: error.message },
    ]);
  }
};

export {
  createChatService,
  sendMessageService,
  getMessagesService,
  getUserChatsService,
  getChatByUsersService,
};
