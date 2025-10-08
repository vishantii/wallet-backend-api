import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({ error: "Too many requests" });
    }

    next();
  } catch (error) {
    console.log("Error limiting the requests", error);
    res.status(429).json({ error: "Too many requests" });
  }
};

export default rateLimiter;
