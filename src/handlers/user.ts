import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { Request, Response } from "express";

interface CustomRequest extends Request {
  body: {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
  }
}

export const signUp = async (
  req: CustomRequest,
  res: Response
) => {
  const { username, password, firstName, lastName, email } = req.body;
  if (!username && !password && !firstName && !lastName && !email) {
    return res.json({ message: "Please fill in all the fields" });
  }
  try {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: await hashPassword(password),
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
    });
    if (user) {
      res.json({ message: "User created please sign in!" });
    } else {
      return res.json({
        message: "Something went wrong! Please try again later..",
      });
    }
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.json({ message: "That username already exists" });
    }
    return res.json({
      message: "Something went wrong! Please try again later..",
    });
  }
};

export const signIn = async (req: CustomRequest, res: Response) => {
  const { username, password } = req.body;

  if (!username && !password) {
    res.json({ message: "Please fill in all the fields" });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = createJWT(user);
  res.json({ token });
};
