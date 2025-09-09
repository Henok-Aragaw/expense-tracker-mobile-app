import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";


export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) =>{
console.log(err);

if(err instanceof ZodError){
    return res.status(400).json({
        message: 'Validation error',
         errors: err.issues,
    })
}

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Database validation error',
      errors: err.errors,
    });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal Server Error' });

}