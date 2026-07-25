import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { LoginInput } from '../validators/auth.validator.js';

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body as LoginInput;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      throw new AppError('Invalid username or password', 401);
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new AppError('Invalid username or password', 401);
    }

    const token = jwt.sign({ adminId: admin._id }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          username: admin.username,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');

    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { admin: { username: admin.username } },
    });
  } catch (error) {
    next(error);
  }
};
