import { Router } from "express";
const router = Router();
import { chatData, userData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: Chat Routes
router.route("/").get(async (req, res) => {
    try{
        const chatList = await chatData.getAllChats();
        res.status(200).json(chatList);
    }catch(e){
        res.status(500).json({error: e});
    }
});

// TODO: GET /chats/:uid - Get All chats for user/aCenter with id
router.route("/user/:uid").get(async (req, res) => {
    const id = validation.checkId(req.params.uid);
    try{
        //could sort by most recent time
        const chatList = await chatData.getAllChatsUser(id);
        // .sort((a,b) => {
        //     b.messages[b.messages.length()-1].messageTime - a.messages[a.messages.length()-1].messageTime
        // });
        res.status(200).json(chatList);
    }catch(e){
        res.status(500).json({error: e});
    }
});

router.route("/acenter/:acid").get(async (req, res) => {
    const id = validation.checkId(req.params.acid);
    try{        
        const chatList = await chatData.getAllChatsACenter(id);
        res.status(200).json(chatList);
    }catch(e){
        res.status(500).json({error: e});
    }
});

// TODO: GET /chats/:uid/:acid - Get chat for user between it and aCenter
router.route("/user/:uid/:acid").get(async (req, res) => {
    const uid = validation.checkId(req.params.uid);
    const acid = validation.checkId(req.params.acid);
    try{
        const chat = await chatData.getChat(uid,acid);
        res.status(200).json(chat);
    }catch(e){
        res.status(500).json({error: e});
    }
});

// TODO: GET /chats/:acid/:uid - Get chat for aCenter between it and user
router.route("/acenter/:acid/:uid").get(async (req, res) => {
    const uid = validation.checkId(req.params.uid);
    const acid = validation.checkId(req.params.acid);
    try{
        const chat = await chatData.getChat(uid,acid);
        res.status(200).json(chat);
    }catch(e){
        res.status(500).json({error: e});
    }
});

// TODO: PUT /chats/:acid/:uid - Sending a message from aCenter to user
router.route("/acenter/:acid/:uid").put(async (req, res) => {
    const uid = validation.checkId(req.params.uid);
    const acid = validation.checkId(req.params.acid);
    const message = validation.checkMessage(req.body.message);
    let date = new Date();
    let time = date.toLocaleDateString();
    time.concat(date.toUTCString().slice(17,29));
    try{
        const newMessage = await chatData.postMessage(
            uid,
            acid,
            acid,
            message,
            time
        );
        res.status(200).json({message: newMessage, sender: uid});
    }catch(e){
        res.status(500).json({error: e});
    }
});

// TODO: PUT /chats/:uid/:acid - Sending a message from user to aCenter
router.route("/user/:uid/:acid").put(async (req, res) => {
    console.log("moew");
    const uid = validation.checkId(req.params.uid);
    const acid = validation.checkId(req.params.acid);
    const message = validation.checkMessage(req.body.message);
    let date = new Date();
    let time = date.toLocaleDateString();
    time = time.concat(date.toUTCString().slice(17,29));
    try{
        const newMessage = await chatData.postMessage(
            uid,
            acid,
            uid,
            message,
            time
        );
        res.status(200).json({message: newMessage, sender: uid});
    }catch(e){
        res.status(500).json({error: e});
    }
});

// TODO: POST /chats/:uid/:acid - Creating a chat between user and aCenter
router.route("/:uid/:acid").post(async (req, res) => {
    const uid = validation.checkId(req.params.uid);
    const acid = validation.checkId(req.params.acid);
    try{
        const chat = chatData.getChat(uid, acid);
        res.status(400).json({foundChat: chat});
    }catch(e){

    }
    try{
        const newChat = chatData.createChat(uid, acid);
        res.status(200).json({Chat: newChat});
    }catch(e){
        res.status(500).json({error: e});
    }
});

export default router;

