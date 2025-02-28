const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    return res.json(user);
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// exports.login = async(req, res, next);

// Get All Users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ data: { users } });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
