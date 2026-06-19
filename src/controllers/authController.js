import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "user registered successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const userId = req.id;
    const targetId = req.params.id;

    if (userId.toString() === targetId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.following.includes(targetId)) {
      return res.status(400).json({
        message: "Already following the user",
      });
    }
    user.following.push(targetId);
    targetUser.followers.push(userId);

    await user.save();
    await targetUser.save();

    return res.status(200).json({
      message: "Followed successfully",
    });
  } catch (error) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
