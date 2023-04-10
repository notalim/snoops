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
    center, 
    senderId,
    messageContent,
    messageTime) => {

}


const exportedMethods = {
    getAllChatsACenter,
    getAllChatsUser,
    createChat,
    getChat,
    postMessage
}
export default exportedMethods;