import jwt from "jsonwebtoken"
import { config } from "dotenv"

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" })
  }

  const token = header.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // if (decoded.id !== req.params.id) {
    //   return res.status(203).json({ success: false, error: "Unauthorized" })
    // }

    req.userLogged = decoded

    next()
  } catch (e) {
    res.status(401).json({ success: false, error: e.message })
  }
}

export { authMiddleware }