function authMiddleware(req, res, next) {
  const requiredToken = process.env.API_TOKEN;

  if (!requiredToken) {
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || token !== requiredToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return next();
}

export { authMiddleware };
