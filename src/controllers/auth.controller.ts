import { Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { organization: true },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        orgId: user.organizationId,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        org: user.organization.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, organizationId } = req.body;

    if (!name || !email || !password || !organizationId) {
    res.status(400).json({ message: "All fields are required." });
    return;
    }

    try {
    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        res.status(409).json({ message: "Email already registered." });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
        name,
        email,
        password: hashedPassword,
        organizationId,
        role: "USER", // default role
        },
    });

    res.status(201).json({
        message: "User registered successfully.",
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        orgId: user.organizationId,
        },
    });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
    }
};