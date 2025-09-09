import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt, { SignOptions } from "jsonwebtoken"
import config from "../config";
import { signupSchema, loginSchema } from "../validation/authSchema";
import { AuthRequest } from "../middleware/auth";

interface JWTPayload {
    id:string;
}

export function signToken(userId:string):string {
    if(!config.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    if(!config.JWT_EXPIRES_IN) throw new Error("JWT_EXPIRES_IN is not defined")
       
        const payload: JWTPayload = {id:userId};

    return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as string | number,
    } as SignOptions);
}

export const signup = async (req: Request, res:Response, next:NextFunction) => {
    
    try {
      const parsed = signupSchema.parse(req.body);
      const {name, email, password} = parsed;
      
      const existing = await User.findOne({email});

       if (existing) return res.status(409).json({ message: 'Email already Taken' });

       const user = await User.create({name, email, password});

       const token = signToken(user.id);

       res.status(201).json({token, user: {id:user.id, name:user.name, email:user.email}})
       
    } catch (error) {
        next(error)
    }
}

export const login = async(req: Request, res: Response, next:NextFunction) => {
    try {
      const parsed = loginSchema.parse(req.body);
      const {email, password} = parsed;
      
      const user = await User.findOne({email});

      if(!user) return res.status(401).json({message: "User not found"});

      const match = await user.comparePassword(password);

      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = signToken(user.id);
      res.json({message:"User Loged in successfully", token, user: { id: user.id, name: user.name, email: user.email } });

    } catch (error) {
        next(error)
    }
}

export const me = async (req: AuthRequest, res: Response) => {
  res.json({ user: { id: req.user!.id, name: req.user!.name, email: req.user!.email } });
};