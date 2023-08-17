// const errorHandler = (err, req, res, next) => {
//   console.log("throwing error")
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   console.log(err)
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// export { errorHandler };