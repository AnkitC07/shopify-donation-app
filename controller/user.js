// import pwd from "../db/model/forgotpassword.js"
// import user from "../db/model/user.js";
import { userToken } from "../util/generateToken.js";
import asyncHandler from "express-async-handler";
// import setcookies from "../util/setCookies.js";
import users from "../credentials/mockData.js";


const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const isUserValid = users.find(u => u.email === email && u.password === password);

  console.log(isUserValid, "getting user Data")

  if (!isUserValid) {
    res.status(401)
    throw new Error("Invalid Email or Password"); 
  }

  res.status(200).json({
    token: userToken(isUserValid),
  });

});

// const updatePassword = asyncHandler(async (req, res) => {
//   const { password, id } = req.body

//   const get = await pwd.findById({ _id: id })
//   if (!get) {
//     res.status(400)
//     throw new Error("Something went wrong")
//   }
//   const update = await user.findById({ _id: get.user })
//   update.password = password
//   const save = await update.save()
//   console.log(save)
//   const del = await pwd.findByIdAndDelete({ _id: id })
//   res.status(200).send({ msg: "Password updated successfully" })
// })


export { Login };