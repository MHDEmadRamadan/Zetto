const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";

exports.test = async (req, res, next) => {
  await res.status(200).json({
    data: "hello api",
  });
};

exports.register = async (req, res, next) => {
  const { username, phone_number, password } = req.body;
  try {
    // 1. Validate input
    if (!username || !phone_number || !password) {
      return res
        .status(400)
        .json({ error: "check filled username,phone_number,password" });
    }
    // 2. Check for existing user (username or phone)
    const existingUser = await prisma.user.findFirst({
      where: { phone_number },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User is existing" });
    }
    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, phone_number, password: hashedPassword },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// Get All Users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ data: { users } });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, password, phone_number } = req.body;
  try {
    if (!username && !password && !phone_number) {
      return res.status(400).json({ error: "Something went wrong" });
    }
    // 2. Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // 3. Hash the password (if provided)
    let hashedPassword = existingUser.password; // Keep the old password if none is provided.
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    // 4. Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        username: username || existingUser.username, // Use existing username if not provided
        password: hashedPassword,
      },
    }); // 5. Send a success response
    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Error updating user:", error); // Added logging
    res.status(500).json({ error: "Something went wrong11" });
  }
};

exports.login = async (req, res, next) => {
  const { phone_number, password } = req.body;
  try {
    if (!phone_number || !password) {
      return res
        .status(400)
        .json({ error: "Please provide phone_number and password" });
    }
    const user = await prisma.user.findFirst({
      where: { phone_number: phone_number },
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    // 2. Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // 3. Generate a JWT token
    const token = jwt.sign(
      { id: user.id, phone_number: user.phone_number },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    // 4. Send a success response with the token
    res.status(200).json({
      status: "success",
      data: { token },
    });
  } catch (error) {
    console.error("Error updating user:", error); // Added logging
    res.status(500).json({ error: "Something went wrong" });
  }
};
