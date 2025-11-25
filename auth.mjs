
import jwt from "jsonwebtoken";
import { initEntities } from "./entities/initEntity.mjs";
import cookieParser from "cookie-parser"
import { JWT_SECRET } from "./app.mjs";
//import { sign } from "crypto"; //module qui s'est importé tout seul dont je ne connaissais pas l'existence, permet de créer des signatures crypter à envoyer

export async function auth(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: no token" });
        }
            console.log("secret_pass:", JWT_SECRET);
        
        const decoded = jwt.verify(token, JWT_SECRET); // payload: { userId: 123, ... } 
        req.userId = decoded.userId; // ex: { userId: 1 }
        const { User } = await initEntities();
        req.user = await User.findByPk(req.userId);
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
         }
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
}

