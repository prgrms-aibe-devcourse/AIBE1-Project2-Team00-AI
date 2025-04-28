require('dotenv').config();

const checkApiKey = (req, res, next) => {
    const apiKey = req.header('Authorization');
    const secretKey = process.env.SECRET_KEY;
  
    if (!apiKey || apiKey !== secretKey) {
      return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
    }
  
    next();
  };
  
  module.exports = checkApiKey;