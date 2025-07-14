import { Request, Response } from 'express';
import { AppError } from '@/utils/AppError';

class SessionsController {
    async create(request: Request, response:Response){

        response.json({message: "Ok"})
    }
}



export {SessionsController};