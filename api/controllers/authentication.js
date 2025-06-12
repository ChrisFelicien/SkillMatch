import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateTokenAndSendResponse from "../utils/generateTokenSendResponse.js";
import AppError from "../utils/AppError.js";

// prevent if req.body is falsy
export const isReqBodyValid = (req, res, next) => {
  if (!req.body) {
    return next(new AppError(`Please provide all required fields`, 400));
  }
  next();
};

export const createUserAccount = asyncHandler(async (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body;
  if (!email || !name || !password || !confirmPassword) {
    return next(
      new AppError(
        `Please provide a name, email password and confirmPassword`,
        400
      )
    );
  }

  if (password !== confirmPassword) {
    return next(new AppError(`Password and confirmPassword should match`, 400));
  }

  //   check if the user exist in DB
  if (await User.findOne({ email })) {
    return next(new AppError("Sorry this email is already used", 400));
  }

  const newUser = await User.create({ email, name, password });

  generateTokenAndSendResponse(res, newUser, 201);
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError(`Please provide email and password`, 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password", 404));
  }

  generateTokenAndSendResponse(res, user, 200);
});

export const logoutUser = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.status(200).json({
    status: "success",
    message: "disconnected"
  });
};

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.cookies &&
    req.cookies.token &&
    req.cookies.token.startsWith("Bearer")
  ) {
    token = req.cookies.token.split(" ")[1];
  }

  if (!token) {
    return next(new AppError(`Seems like you are not logged in`, 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  // is password has been changed after the jwt was issued
  const passwordChangedAfter = user.passwordChangedAfter(decoded.iat);

  if (passwordChangedAfter) {
    return next(
      new AppError(`Seems like your password was changed login again`, 400)
    );
  }

  req.user = user;

  next();
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(
      new AppError(
        `Please provide the current password, the new password and confirm your new password`,
        400
      )
    );
  }

  if (currentPassword === newPassword) {
    return next(
      new AppError(
        `Sorry your new password should be different to your actual password`,
        400
      )
    );
  }

  if (confirmPassword !== newPassword) {
    return next(
      new AppError(
        `Sorry your new password and the confirmPassword should match`,
        400
      )
    );
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError("Please provide the valid current password", 401));
  }
  // change the password
  user.password = newPassword;
  await user.save();

  return generateTokenAndSendResponse(res, user, 200);
});

export const userProfile = asyncHandler((req, res, next) => {
  const user = req.user;

  generateTokenAndSendResponse(res, user, 200);
});
