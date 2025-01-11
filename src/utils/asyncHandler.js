const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      // Send the error response
      res.status(err.code || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    }
  };
};

export { asyncHandler };
