import { chats } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import exportedMethods from "./users.js";

const chatCollection = await chats();

const getAllChatsACenter = async (centerID) => {
    centerID = validation.checkId(centerID, "CenterID");
    const centerChats = await chatCollection.find({centerID: new ObjectId(centerID)}).toArray();
    return centerChats;
}

const getAllChatsUser = async (userID) => {
    userID = validation.checkId(userID, "UserID");
    const userChats = await chatCollection.find({userID: new ObjectId(userID)}).toArray();
    return userChats;
}

const createChat = async (userID, centerID) => {

}

const getChat = async (userID, centerID) => {

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