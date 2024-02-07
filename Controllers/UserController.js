const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModels.js");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400);
      throw new Error("User alerady exists");
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

const loginUser = asyncHandler(async (req,res) => {
  const { username, password } = req.body;
  
  try{
    const user = await User.findOne({username});
    if(user && (await bcrypt.compare(password, user.password))){
      res.status(200).json(user);
    }
    else{
      res.status(401);
      throw new Error(" Invalid username or password");
    }
  }catch(error){
    res.status(400).json({
     message: error.message
    });

   }

});
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const updateToken = asyncHandler(async (req, res)=>{

  const {username, fcmToken } = req.body;

  console.log(" USENAME : "  + username)
  console.log(" FCM TOKEN  : "  + fcmToken)

  const updated = await User.findOneAndUpdate(
    {username}, {fcmToken}, {new: true}

  )

  return res.json(updated);
  

}
)

module.exports = { loginUser, registerUser, getUsers, updateToken };
