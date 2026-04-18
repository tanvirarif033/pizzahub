const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // debug

    if (!authHeader) {
      return res.status(401).json({ msg: 'No token' });
    }

    const token = authHeader.split(' ')[1];

    console.log("TOKEN:", token); // debug

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};