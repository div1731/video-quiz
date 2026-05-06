import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await authService.registerUser(req.body);
    authService.createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.loginUser(req.body);
    authService.createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is populated by protect middleware
    res.status(200).json({
      status: 'success',
      data: {
        user: (req as any).user,
      },
    });
  } catch (err) {
    next(err);
  }
};
