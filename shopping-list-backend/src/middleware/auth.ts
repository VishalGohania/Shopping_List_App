import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { error } from "node:console";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Auth header:', req.headers.authorization);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET value:', process.env.JWT_SECRET);

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Authentication required' });
    }

    console.log('Token:', token.substring(0, 20) + '...');

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.error('JWT Verify Error:');
    console.error('- Name:', error.name);
    console.error('- Message:', error.message);
    console.error('- Full error:', error);
    res.status(401).json({ error: 'Invalid token', details: error.message });

  }
}