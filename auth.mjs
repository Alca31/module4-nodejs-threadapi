
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser"
//import { sign } from "crypto"; //module qui s'est importé tout seul dont je ne connaissais pas l'existence, permet de créer des signatures crypter à envoyer
const secret_key = "chutfautpasledire";
const secret_pass = process.env.JWT_SECRET||secret_key;

export function auth(req, res, next) {
    try {
        const token = req.cookies?.jwttoken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: no token" });
        }

        const decoded = jwt.verify(token, SECRET);
        // payload: { userId: 123, ... }
        if (req.userId) 
        {
            req.userId = decoded.userId; // ex: { userId: 1 }
        } 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
}

