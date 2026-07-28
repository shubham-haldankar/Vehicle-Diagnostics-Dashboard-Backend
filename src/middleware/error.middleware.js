function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || "internal server error";

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json({ error: message });
}

export { errorMiddleware };
