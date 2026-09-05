import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticateToken.
 *
 * Usage:
 *   router.get('/operator/dashboard', authenticateToken, requireRole('OPERATOR', 'ADMIN'), handler);
 *   router.get('/admin/stats', authenticateToken, requireRole('ADMIN'), handler);
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.userRole || 'TRAVELER';

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        error: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}.`,
      });
      return;
    }

    next();
  };
};

/**
 * Convenience middleware: allow any authenticated user (all roles).
 * This is functionally identical to just using authenticateToken,
 * but makes intent explicit in route definitions.
 */
export const requireAnyRole = requireRole('TRAVELER', 'OPERATOR', 'COORDINATOR', 'ADMIN');

/**
 * Convenience: operator or admin only.
 */
export const requireOperator = requireRole('OPERATOR', 'ADMIN');

/**
 * Convenience: coordinator, operator, or admin.
 */
export const requireCoordinator = requireRole('COORDINATOR', 'OPERATOR', 'ADMIN');

/**
 * Convenience: admin only.
 */
export const requireAdmin = requireRole('ADMIN');
