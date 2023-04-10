import { chats } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import exportedMethods from "./users.js";

const chatCollection = await chats();

const getAllChatsACenter = async (centerID) => {
    centerID = validation.checkId(centerID, "CenterID");
    const centerChats = await chatCollection.find({centerId: new ObjectId(centerID)}).toArray();
    if(centerChats === null){
        throw `No chats for aCenter with ID ${centerID}`
    }
    return centerChats;
}

const getAllChatsUser = async (userID) => {
    userID = validation.checkId(userID, "UserID");
    const userChats = await chatCollection.find({userId: new ObjectId(userID)}).toArray();
    if(userChats === null){
        throw `No chats for aCenter with ID ${userID}`
    }
    return userChats;
}

const createChat = async (userID, centerID) => {
    userID = validation.checkId(userID, "UserID");
    centerID = validation.checkId(centerID, "CenterID");

    const chat = await chatCollection.findOne({userId: userID, centerId: centerID});
    if(chat){
        throw `chat between user: ${userID} and aCenter: ${centerID} already exists`
    }
    const newChat = {
        userId : userID,
        centerId : centerID,
        messages : []
    }

    const newInsertInformation = await chatCollection.insertOne(newChat);
    if (newInsertInformation.insertedCount === 0) {
        throw `Could not create chat between user: ${userID} and aCenter: ${centerID}`;
    }

    return newChat;
}

const getChat = async (userID, centerID) => {
    userID = validation.checkId(userID, "UserID");
    centerID = validation.checkId(centerID, "CenterID");

    const userChats = await chatCollection.find(
        {userId: new ObjectId(userID),
        centerId: new ObjectId(centerID)});

    if(userChats === null){
        throw `No chat between user: ${userID} and aCenter: ${centerID}`;
    }

    return userChats;
}

const postMessage = async (
    userID, 
    centerID, 
    senderID,
    messageContent,
    messageTime) => {

    userID = validation.checkId(userID, "UserID");
    centerID = validation.checkId(centerID, "CenterID");
    senderID = validation.checkId(senderID, "SenderID");

    //create validation for messages which includes censoring
    messageContent = validation.checkMessage(messageContent, "Message");
   
    const newMessage = {
        senderId : new ObjectId(senderID),
        messageContent : messageContent,
        messageTime : messageTime
    }

    const updatedInfo = chatCollection.findOneAndUpdate({userId: userID, centerId: centerID},
        {$push : {messages : newMessage}}, {returnDocument: 'after'});

    if (updatedInfo.lastErrorObject.n === 0) {
        throw [404,'could not update message successfully'];
    }

    return newMessage;
}


const exportedMethods = {
    getAllChatsACenter,
    getAllChatsUser,
    createChat,
    getChat,
    postMessage
}
export default exportedMethods;