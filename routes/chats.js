import { Router } from "express";
const router = Router();
import { chatData, userData } from "../data/index.js";
import * as validation from "../validation.js";
import xss from 'xss';

// TODO: Chat Routes

// TODO: GET / - Getting all chats between all users
// router.route("/").get(async (req, res) => {
//     try {
//         const chatList = await chatData.getAllChats();
//         return res.status(200).json(chatList);
//     } catch (e) {
//         return res.status(500).json({ error: e });
//     }
// });

// TODO: GET /user/:uid - Get All chats for user with id sorted by most recent
router.route("/user/:uid").get(async (req, res) => {
    if(!req.session.user && req.session.user._id !== req.params.uid){
        return res.status(400).redirect("404Page");
    }
    let id;
    try{
        id = validation.checkId(req.params.uid);
    }catch(e){
        return res.status(400).json({ error: e });
    }
    try {
        //could sort by most recent time
        const chatList = await chatData.getAllChatsUser(id);
        let sorted = chatList.sort((a, b) => {
            if (a.messages.length === 0) {
                return 1;
            } else if (b.messages.length === 0) {
                return -1;
            } else {
                //comparing times of most recent messages
                return b.messages[
                    b.messages.length - 1
                ].messageTime.localeCompare(
                    a.messages[a.messages.length - 1].messageTime
                );
            }
        });
        return res.status(200).render("user-chats", {title: "Messages", chats: sorted});
    } catch (e) {
        return res.status(500).render("no-chats", {error: e, title:"No Chats"});
    }
});

// TODO: GET /acenter/:acid - Get All chats for aCenter with id sorted by most recent
router.route("/acenter/:acid").get(async (req, res) => {
    // console.log(req.session);
    if(!req.session.acenter && req.session.acenter._id !== req.params.acid){
        return res.status(400).redirect("404Page");
    }
    let id;
    try{
        id = validation.checkId(req.params.acid);
    }catch(e){
        return res.status(400).json({ error: e });
    }
    try {
        const chatList = await chatData.getAllChatsACenter(id);
        let sorted = chatList.sort((a, b) => {
            if (a.messages.length === 0) {
                return 1;
            } else if (b.messages.length === 0) {
                return -1;
            } else {
                //comparing times of most recent messages
                return b.messages[
                    b.messages.length - 1
                ].messageTime.localeCompare(
                    a.messages[a.messages.length - 1].messageTime
                );
            }
        });
        return res.status(200).render("ac-chats", {title: "Messages", chats: sorted});
    } catch (e) {
        return res.status(500).render("no-chats", {error: e, title:"No Chats"});
    }
});

// TODO: GET /user/:uid/:acid - Get chat for user between it and aCenter
router.route("/user/:uid/:acid").get(async (req, res) => {
    let uid;
    let acid;
    console.log(`${req.session.user._id} ${req.params.uid}`)
    if(!req.session.user && req.session.user._id !== req.params.uid){
        return res.status(400).redirect("404Page");
    }
    try{
        uid = validation.checkId(req.params.uid);
        acid = validation.checkId(req.params.acid);
    }catch(e){
        return res.status(400).render("404Page", {error: e})
    }
    try {
        const chat = await chatData.getChat(uid, acid);
        return res.status(200).json(chat);
    } catch (e) {
        //might throw diff page
        return res.status(500).render("404Page", {error: e});
    }
});

// TODO: GET /acenter/:acid/:uid - Get chat for aCenter between it and user
router.route("/acenter/:acid/:uid").get(async (req, res) => {
    let uid;
    let acid;
    if(!req.session.acenter && req.session.acenter._id !== req.params.acid){
        return res.status(400).redirect("404Page");
    }
    try{
        uid = validation.checkId(req.params.uid);
        acid = validation.checkId(req.params.acid);
    }catch(e){
        return res.status(400).render("404Page", {error: e});
    }
    try {
        const chat = await chatData.getChat(uid, acid);
        return res.status(200).json(chat);
    } catch (e) {
        //might throw diff page
        return res.status(500).render("404Page", {error: e});
    }
});

// TODO: PUT /acenter/:acid/:uid - Sending a message from aCenter to user
router.route("/acenter/:acid/:uid").put(async (req, res) => {
    let uid;
    let acid;
    let message;
    let time;

    try{
        uid = validation.checkId(req.params.uid);
        acid = validation.checkId(req.params.acid);
        message = xss(req.body.message);
        message = validation.checkMessage(message);
        let date = new Date();
        time = date.toLocaleDateString();
        time = time.concat(" ");
        time = time.concat(date.toUTCString().slice(17, 29));

    }catch(e){
        return res.status(400).json({ error: e });
    }

    try {
        const newMessage = await chatData.postMessage(
            uid,
            acid,
            acid,
            message,
            time
        );
        return res.status(200).json({ message: newMessage, sender: uid });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: PUT /user/:uid/:acid - Sending a message from user to aCenter
router.route("/user/:uid/:acid").put(async (req, res) => {
    let uid;
    let acid;
    let message;
    let time;

    try{
        uid = validation.checkId(req.params.uid);
        acid = validation.checkId(req.params.acid);
        message = xss(req.body.message);
        message = validation.checkMessage(message);
        let date = new Date();
        time = date.toLocaleDateString();
        time = time.concat(" ");
        time = time.concat(date.toUTCString().slice(17, 29));

    }catch(e){
        return res.status(400).json({ error: e });
    }
    try {
        const newMessage = await chatData.postMessage(
            uid,
            acid,
            uid,
            message,
            time
        );
        return res.status(200).json({ message: newMessage, sender: uid });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// TODO: POST /:uid/:acid - Creating a chat between user and aCenter
router.route("/:uid/:acid").post(async (req, res) => {
    let uid;
    let acid;

    try{
        uid = validation.checkId(req.params.uid);
        acid = validation.checkId(req.params.acid);
    }catch(e){
        return res.status(400).json({ error: e });
    }

    try {
        const chat = await chatData.getChat(uid, acid);
        return res.status(409).json({
            foundChat: chat,
            Message: "Chat already exist",
        });
    } catch (e) {
        try {
            const newChat = await chatData.createChat(uid, acid);
            return res.redirect(200, `/chats/user/${uid}`);
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    }
});

export default router;
