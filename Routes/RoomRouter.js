const express = require('express');
const { getRoom, addRoom, getUserRooms, getRoomParticipants } = require('../Controllers/RoomController');

const router = express.Router();

router.post("/", addRoom);
router.get("/:id", getRoom);
router.get("/user/:id", getUserRooms);
router.get('/participants/:id', getRoomParticipants);

module.exports = router