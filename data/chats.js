import { chats } from "../config/mongoCollections.js";
import { acenters } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "../validation.js";

const chatCollection = await chats();

const getAllChats = async () => {
    const allChats = await chatCollection.find().toArray();
    if(allChats.length === 0){
        throw "There are no chats";
    }
    return allChats;
}

const getAllChatsACenter = async (centerID) => {
    centerID = validation.checkId(centerID, "CenterID");
    const centerChats = await chatCollection.find({centerId: centerID}).toArray();
    if(centerChats.length === 0){
        throw `No chats for aCenter with ID ${centerID}`
    }
    return centerChats;
}

const getAllChatsUser = async (id) => {
    id = validation.checkId(id, "UserID");
    let userChats = await chatCollection.find({userId: id}).toArray();
    if(userChats.length === 0){
        throw `No chats for User with ID ${id}`
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

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(userID)});
    if(!user){
        throw `No user with id: ${userID}. Error finding user from db.`
    }

    const acenterCollection = await acenters();
    const acenter = await acenterCollection.findOne({_id: new ObjectId(centerID)});
    if(!acenter){
        throw `No acenter with id: ${centerID}. Error finding user from db.`
    }


    const newChat = {
        userId: userID,
        centerId: centerID,
        userName: user.firstName + " " + user.lastName,
        acenterName: acenter.name,
        messages: []
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

    const userChats = await chatCollection.findOne(
        {userId: userID,
        centerId: centerID});
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

    messageContent = validation.checkMessage(messageContent, "Message");
    messageTime = validation.checkString(messageTime, "Message Time");
    const newMessage = {
        senderId : new ObjectId(senderID),
        messageContent : messageContent,
        messageTime : messageTime
    }

    const updatedInfo = await chatCollection.findOneAndUpdate({userId: userID, centerId: centerID},
        {$push : {messages : newMessage}}, {returnDocument: 'after'});
    //console.log(updatedInfo);
    if (updatedInfo.lastErrorObject.n === 0) {
        throw [404,'could not update message successfully'];
    }

    return newMessage;
}


const exportedMethods = {
    getAllChats,
    getAllChatsACenter,
    getAllChatsUser,
    createChat,
    getChat,
    postMessage
}
export default exportedMethods;