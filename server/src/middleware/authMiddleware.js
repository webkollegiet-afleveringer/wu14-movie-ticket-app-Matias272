import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
