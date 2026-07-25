import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFound = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    let message = err.message;

    if (err.statusCode === 400) {
      try {
        const parsed = JSON.parse(err.message);
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: parsed,
        });
        return;
      } catch {
      }

    }

    res.status(err.statusCode).json({
      success: false,
      message,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    const mongooseErr = err as Error & {
      errors: Record<string, { message: string }>;
    };
    const errors = Object.values(mongooseErr.errors).map((e) => ({
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate field value entered',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
