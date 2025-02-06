import rateLimit from "express-rate-limit";

export const messageLimiter = rateLimit({
    windowMs: 60*1000,
    max: 20,
    message: {error: "Take it easy Buddy!"}
})