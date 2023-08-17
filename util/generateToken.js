import jwt from "jsonwebtoken";
//process.env.JWT_SECRET
const generateToken = (id) => {
  return jwt.sign(id, "123456789", {
    expiresIn: "3d",
  });
};


const userToken = (user) => {
  const userData = {
    email: user.email,
    password: user.password
  }
  return generateToken(userData)
}

export { userToken }
export default generateToken;