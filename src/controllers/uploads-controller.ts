import { DiskStorage } from "@/providers/disk-storage";
import { Request, Response } from "express";
import uploadConfig from "@/configs/upload";
import z, { ZodError } from "zod";
import { AppError } from "@/utils/AppError";

class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage();
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Filename is required"),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfig.ACCEPTED_IMAGES_TYPES.includes(type),
              `Invalid file format. Allowed formats: ${uploadConfig.ACCEPTED_IMAGES_TYPES}`
            ),
          size: z
            .number()
            .positive()
            .refine(
              (size) => size <= uploadConfig.MAX_FILE_SIZE,
              `File size exceeds the limit of ${uploadConfig.MAX_SIZE}MB`
            ),
        })
        .passthrough();

      const file = fileSchema.parse(request.file);
      const filename = await diskStorage.saveFile(file.filename);

      response.json({ filename });
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, "tmp");
        }
        throw new AppError(error.issues[0].message);
      }
      throw error;
    }

    response.json({ file: request.file });
  }
}

export { UploadsController };
