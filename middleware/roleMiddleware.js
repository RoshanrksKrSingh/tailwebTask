
/**
 * Middleware to restrict access based on user roles.
 *  List of allowed roles (e.g., 'teacher', 'student')
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Requires one of the following roles: ${roles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = checkRole;