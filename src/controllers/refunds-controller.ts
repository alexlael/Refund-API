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
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });
    const { name, page, perPage } = querySchema.parse(request.query);

    //calcula os valores de "skip" para paginação
    const skip = (page - 1) * perPage;

    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });

    //obter o total de registros para calcular o número de páginas
    const totalRecords = await prisma.refunds.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    response.json({refunds,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
      },
    });
  }

  async show(request: Request, response: Response){
    const paramsSchema = z.object({
      id: z.string().uuid("Invalid refund ID format"),
    });

    const { id } = paramsSchema.parse(request.params);

    const refund = await prisma.refunds.findFirst({
      where: { id },
      include: { user: true },
    });

    if (!refund) {
      throw new AppError("Refund not found", 404);
    }

    return response.json(refund);

  }
}

export { RefundsController };
