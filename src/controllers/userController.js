const register = (req, res, next) => {
  res.status(200).json({
    data: "hello api",
  });
};

module.exports = { register };
