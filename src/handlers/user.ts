import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";

export const signUp = async (
  req: {
    body: {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  },
  res: any
) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

export const signIn = async (req: any, res: any) => {
  const { username, password } = req.body;

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
