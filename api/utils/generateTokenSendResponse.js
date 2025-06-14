import Token from "../models/Token.js";
import { generateAccessToken, generateRefreshToken } from "./generateToken.js";

const generateTokenAndSendResponse = async (res, user, statusCode) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Delete the old toke
  const token = await Token.findOneAndDelete({ user: user._id });

  // create a new refresh token
  await Token.create({
    user: user._id,
    refreshToken,
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  });

  //   Send token via cookie only
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 //Expire in 7days
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 //Expire in 7days
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    user
  });
};

export default generateTokenAndSendResponse;
