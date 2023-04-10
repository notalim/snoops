import { chats } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";
import exportedMethods from "./users.js";

const chatCollection = await chats();

const getAllChatsACenter = async (centerID) => {

}

const getAllChatsUser = async (userID) => {
    
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