import express from "express";

import {
  loginUser,
  logoutUser,
  createUserAccount,
  isReqBodyValid,
  userProfile,
  protect,
  changeUserPassword
} from "./../controllers/authentication.js";

const router = express.Router();

router.post("/login", isReqBodyValid, loginUser);
router.post("/signup", isReqBodyValid, createUserAccount);
router.get("/logout", protect, logoutUser);
router.post("/change-password", protect, isReqBodyValid, changeUserPassword);
router.get("/me", protect, userProfile);

export default router;
