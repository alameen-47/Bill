import jwt from 'jsonwebtoken';

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        succes: false,
        message: 'Authorization header missing',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        succes: false,
        messge: 'Token Missing',
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or Expired Token',
    });
  }
};
