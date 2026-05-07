import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';

export const signToken = (id: string) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const createSendToken = (user: any, statusCode: number, res: any) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const registerUser = async (data: any) => {
  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return newUser;
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError('Please provide email and password!', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await (user as any).correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  return user;
};
