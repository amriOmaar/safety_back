
const Room = require("../Models/RoomModel.js");
const User = require("../Models/UserModels.js");
const mongoose = require('mongoose')
const asyncHandler = require("express-async-handler")



const getRoom = asyncHandler(async (req, res) => {
    const { id } = req.params
    const room = await Room.findById(id).populate({
        path: 'messages.user',
        select: 'username',
    });
    if (!room) {
        return res.status(404).json({ message: "Room not found" })
    }

    return res.status(200).json(room)

})

const addRoom = asyncHandler(async (req, res) => {
    const { members, name } = req.body
    const users = members.map(m => mongoose.Types.ObjectId(m));

    const room = await Room.create({
        users,
        name
    });
    if (!room) {
        return res.status(400).json({ message: "Room not created" })
    }
    global.io.emit('newRoom', room);
    return res.status(201).json(room)

})


const getUserRooms = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const rooms = await Room.find({ users: user._id });
    if (!rooms) {
        return res.status(404).json({ message: "Rooms not found" })
    }


    return res.status(200).json(rooms)
})


const getRoomParticipants = asyncHandler(async (req, res) => {
    const { id: roomId } = req.params
    if (!roomId) {
        return res.status(404).json({ message: "Room not found" })
    }
    const room_participants = await Room.findById(roomId).populate({path:'users',select:'username'});
    if (!room_participants) {
        return res.status(404).json({ message: "Room not found" })
    }
    return res.status(200).json(room_participants)
})

module.exports = { getRoom, addRoom, getUserRooms,getRoomParticipants }