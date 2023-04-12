import { Router } from "express";
const router = Router();
import { chatData, userData } from "../data/index.js";
import * as validation from "../validation.js";

// TODO: Chat Routes

// TODO: GET /chats/:id - Get All chats for user/aCenter with id
router.route("/:id").get(async (req, res) => {

});

// TODO: GET /chats/:uid/:acid - Get chat for user between it and aCenter
router.route("/:uid/:acid").get(async (req, res) => {

});

// TODO: GET /chats/:acid/:uid - Get chat for aCenter between it and user
router.route("/:acid/:uid").get(async (req, res) => {

});

// TODO: PUT /chats/:acid/:uid - Sending a message from aCenter to user
router.route("/:acid/:uid").put(async (req, res) => {

});

// TODO: PUT /chats/:uid/:acid - Sending a message from aCenter to user
router.route("/:uid/:acid").put(async (req, res) => {

});

// TODO: POST /chats/:uid/:acid - Creating a chat between user and aCenter
router.route("/:uid/:acid").post(async (req, res) => {

});

export default router;

