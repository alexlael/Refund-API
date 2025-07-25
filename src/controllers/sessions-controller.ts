import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { authConfig } from "@/configs/auth";
import { prisma } from "@/database/prisma";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { z } from "zod";

class SessionsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new AppError("Credentials are not valid", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Credentials are not valid", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user

    response.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
