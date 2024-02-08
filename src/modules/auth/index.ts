import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePassword = (password: string, hash: any) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user: { id: any; username: string }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  // token is now a string
  return token;
};

export const protect = (req: { headers: { authorization: any; }; user: string | jwt.JwtPayload; }, res: { status: (arg0: number) => void; json: (arg0: { message: string; }) => void; }, next: () => void) => {
  const bearer = req.headers.authorization; // check for the auth header

  if (!bearer) {
    res.status(401);
    res.json({ message: "not authorised" });
    return;
  }
  // we split on space as the user sends up "'Bearer' 'Token'"
  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }
};
