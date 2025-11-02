import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// ---------------------- INTERFACES ----------------------
interface UserSession {
  id: string;
  name?: string;
  mobile: string;
  bio?: string | null;
  profileUrl?: string | null;
}

interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// ---------------- GENERATE TOKEN ----------------
export const generateToken = (user: UserSession, res: Response): void => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  // Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Set cookie with the token
  res.cookie('jwt', token, {
    httpOnly: true, // JS cannot access
    secure: process.env.NODE_ENV === 'production', // ✅ only HTTPS in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ cross-site cookies in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  console.log('✅ Token generated for user:', user.id);
};

// ---------------- VERIFY TOKEN ----------------
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET missing in environment variables');
    res.status(500).json({ error: 'Server configuration error.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    (req as any).user = decoded; // attach user payload to request
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// ---------------- LOGOUT ----------------
export const degradeToken = (res: Response): void => {
  try {
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    console.log('✅ User logged out');
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ message: 'Unsuccessful logout' });
  }
};
