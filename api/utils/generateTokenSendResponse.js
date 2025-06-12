import jwt from "jsonwebtoken";

const generateTokenAndSendResponse = (res, user, statusCode) => {
  // generateToken
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });

  //   Send token via cookie only
  res.cookie("token", `Bearer ${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 //Expire in 7days
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user
  });
};

export default generateTokenAndSendResponse;
