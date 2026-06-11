import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }

  const token = header.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.userLogged = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    }

    next()
  } catch (e) {
    res.status(401).json({ success: false, error: "Invalid or expired token" })
  }
}

export { authMiddleware }