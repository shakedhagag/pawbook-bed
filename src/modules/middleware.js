import { validationResult } from "express-validator";

export const handleInputErrors = (err, req, res, next) => {
  const errors = validationResult(req);
  if (err) {
    res.status(400);
    res.json({ error: err.message });
  } else {
    next();
  }
};
