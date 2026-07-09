// Takes a list of rules, returns middleware that checks them
const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push(`${rule.field} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rule.type && typeof value !== rule.type) {
          errors.push(`${rule.field} must be a ${rule.type}`);
        }
        if (rule.minLength && String(value).trim().length < rule.minLength) {
          errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
        }
        if (rule.maxLength && String(value).trim().length > rule.maxLength) {
          errors.push(`${rule.field} must be under ${rule.maxLength} characters`);
        }
        if (rule.min && value < rule.min) {
          errors.push(`${rule.field} must be at least ${rule.min}`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

module.exports = validate;