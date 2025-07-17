import { Category } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

const CategoriesEnum = z.enum(["food", "others", "services", "transport"]);

class RefundsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(1, "Name is required"),
      category: CategoriesEnum,
      amount: z.number().min(0.01, "Amount must be greater than 0"),
      filename: z.string().min(20, "Filename is required"),
    });

    const { name, category, amount, filename } = bodySchema.parse(request.body);

    if (!request.user?.id) {
      throw new AppError("User not authenticated", 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: request.user.id,
      },
    });

    return response.status(201).json(refund);
  }
  async index(request: Request, response: Response) {

    const querySchema = z.object({
      name: z.string().optional().default(""),
    })
    const { name } = querySchema.parse(request.query);

    const refunds = await prisma.refunds.findMany({
      where:{
        user:{
          name:{
            contains: name.trim()
          }
        }
      },
      orderBy:{createdAt: "desc"},
      include:{
        user: true,
      }
    });

    response.json(refunds);
  }
}

export { RefundsController };
