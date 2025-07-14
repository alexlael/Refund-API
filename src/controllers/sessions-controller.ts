import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";
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

    response.json({ email, password });
  }
}

export { SessionsController };
