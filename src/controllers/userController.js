exports.register = (req, res, next) => {
  res.status(200).json({
    data: "hello api",
  });
};
