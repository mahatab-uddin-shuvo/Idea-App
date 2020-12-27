const rateLimit = require("express-rate-limit");

//configuring rate limit
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hr
    max: 10, // limit each IP to 100 requests per windowMs
    message: 'Too  many account creation activation'
  });
  
  const loginLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hr 
      max: 10, // limit each IP to 100 requests per windowMs
      message: 'Too  many login attemps'
  });
  
  const forgetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hr
    max: 2, // limit each IP to 100 requests per windowMs
    message: 'Too many password reset attemps'
  });

  module.exports = {
    registerLimiter,
    loginLimiter,
    forgetPasswordLimiter
  }