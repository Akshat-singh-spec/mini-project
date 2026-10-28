function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({
      message: `A record with this ${err.meta?.target?.join(", ") || "value"} already exists.`,
    });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "The requested record was not found." });
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server.",
  });
}

module.exports = { notFound, errorHandler };
