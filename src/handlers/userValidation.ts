import { comparePassword, createJWT, hashPassword } from "../modules/auth";
import { NextFunction, Request, Response } from "express";

export function userValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password, firstName, lastName, email } = req.body;
  if (!username && !password && !firstName && !lastName && !email) {
    return res.json({ message: "Please fill in all the fields" });
  }

  // username validation
  const usernameValidation = validateUsername(username);
  if (usernameValidation.isError === true) {
    return res.status(400).json({ message: usernameValidation.message });
  }
  // firstname validation
  const firstNameValidation = validateFirstname(firstName);
  if (firstNameValidation.isError === true) {
    return res.status(400).json({ message: usernameValidation.message });
  }

  // lastname validation
  const lastNameValidation = validateLastname(lastName);
  if (lastNameValidation.isError === true) {
    return res.status(400).json({ message: usernameValidation.message });
  }

  // email validation
  const emailValidation = validateEmail(email);
  if (emailValidation === false) {
    return res.status(400).json({ message: "Invalid email" });
  }
}

function validateUsername(data: string) {
  if (data.length <= 4) {
    return {
      isError: true,
      message: "Username must be at least five characters",
    };
  } else if (data.length >= 17) {
    return {
      isError: true,
      message: "Username cannot be longer than 16 characters",
    };
  } else if (!regex.username.test(data)) {
    return {
      isError: true,
      message: "Invalid username format",
    };
  } else {
    return {
      isError: false,
      message: "Username is valid",
    };
  }
}

function validateFirstname(data: string) {
  if (data.length <= 1) {
    return {
      isError: true,
      message: "Are you sure your names that small? ;)",
    };
  } else if (data.length >= 25) {
    return {
      isError: true,
      message: "Are you sure your names that large? ;)",
    };
  } else if (!regex.firstname.test(data)) {
    return {
      isError: true,
      message: "Invalid name format",
    };
  } else {
    return {
      isError: false,
      message: "Name is valid",
    };
  }
}

function validateLastname(data: string) {
  if (data.length <= 1) {
    return {
      isError: true,
      message: "Are you sure your names that small? ;)",
    };
  } else if (data.length >= 25) {
    return {
      isError: true,
      message: "Are you sure your names that large? ;)",
    };
  } else if (!regex.firstname.test(data)) {
    return {
      isError: true,
      message: "Invalid name format",
    };
  } else {
    return {
      isError: false,
      message: "Name is valid",
    };
  }
}

function validateEmail(data: string) {
  return regex.email.test(data);
}

const regex = {
  username: /^[a-zA-Z0-9_]+$/,
  firstname: /^[a-zA-Z]+$/,
  lastname: /^[a-zA-Z]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};
