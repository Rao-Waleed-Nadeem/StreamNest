const promiseHandler = (requestHandler) => {
  async (req, res, next) => {
    promise.resolve(await requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};

export default promiseHandler;
