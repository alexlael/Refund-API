import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

class UsersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, "Name is required"),
      email: z.string().email("Invalid email format").toLowerCase(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(request.body);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });

    response.json({name, email, password, role});
  }

  async index(request: Request, response: Response) {}

  async updtate(request: Request, response: Response) {}
}

export { UsersController };
