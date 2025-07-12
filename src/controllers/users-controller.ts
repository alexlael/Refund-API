import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, "Name is required"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    });

    const { name, email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async index(request: Request, response: Response) {}

  async updtate(request: Request, response: Response) {}
}

export { UsersController };
