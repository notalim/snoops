import { Router } from "express";
const router = Router();
import { chatData, userData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: Chat Routes

// TODO: GET / - Getting all chats between all users
router.route("/").get(async (req, res) => {
    try {
        const chatList = await chatData.getAllChats();
        res.status(200).json(chatList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /user/:uid - Get All chats for user with id sorted by most recent
router.route("/user/:uid").get(async (req, res) => {
    const id = validation.checkId(req.params.uid);

    try {
        //could sort by most recent time
        const chatList = await chatData.getAllChatsUser(id);
        let sorted = chatList.sort((a, b) => {
            console.log([a, b]);
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
        res.status(200).json(sorted);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /acenter/:acid - Get All chats for aCenter with id sorted by most recent
router.route("/acenter/:acid").get(async (req, res) => {
    const id = validation.checkId(req.params.acid);

    try {
        const chatList = await chatData.getAllChatsACenter(id);
        let sorted = chatList.sort((a, b) => {
            console.log([a, b]);
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
        res.status(200).json(sorted);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /user/:uid/:acid - Get chat for user between it and aCenter
router.route("/user/:uid/:acid").get(async (req, res) => {
    const uid = validation.checkId(req.params.uid);

    const acid = validation.checkId(req.params.acid);

    try {
        const chat = await chatData.getChat(uid, acid);
        res.status(200).json(chat);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: GET /acenter/:acid/:uid - Get chat for aCenter between it and user
router.route("/acenter/:acid/:uid").get(async (req, res) => {
    const uid = validation.checkId(req.params.uid);

    const acid = validation.checkId(req.params.acid);

    try {
        const chat = await chatData.getChat(uid, acid);
        res.status(200).json(chat);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: PUT /acenter/:acid/:uid - Sending a message from aCenter to user
router.route("/acenter/:acid/:uid").put(async (req, res) => {
    const uid = validation.checkId(req.params.uid);

    const acid = validation.checkId(req.params.acid);

    const message = validation.checkMessage(req.body.message);

    let date = new Date();
    let time = date.toLocaleDateString();
    time = time.concat(" ");
    time = time.concat(date.toUTCString().slice(17, 29));

    try {
        const newMessage = await chatData.postMessage(
            uid,
            acid,
            acid,
            message,
            time
        );
        res.status(200).json({ message: newMessage, sender: uid });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: PUT /user/:uid/:acid - Sending a message from user to aCenter
router.route("/user/:uid/:acid").put(async (req, res) => {
    const uid = validation.checkId(req.params.uid);

    const acid = validation.checkId(req.params.acid);

    const message = validation.checkMessage(req.body.message);

    let date = new Date();
    let time = date.toLocaleDateString();
    time = time.concat(" ");
    time = time.concat(date.toUTCString().slice(17, 29));

    try {
        const newMessage = await chatData.postMessage(
            uid,
            acid,
            uid,
            message,
            time
        );
        res.status(200).json({ message: newMessage, sender: uid });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

// TODO: POST /:uid/:acid - Creating a chat between user and aCenter
router.route("/:uid/:acid").post(async (req, res) => {
    const uid = validation.checkId(req.params.uid);

    const acid = validation.checkId(req.params.acid);

    try {
        const chat = await chatData.getChat(uid, acid);
        res.status(400).json({
            foundChat: chat,
            Message: "Chat already exist",
        });
    } catch (e) {
        try {
            const newChat = await chatData.createChat(uid, acid);
            res.status(200).json({ Chat: newChat });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }
});

export default router;
