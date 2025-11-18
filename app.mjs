import { initEntities } from "./models/initEntity.mjs";
import { Routes } from "routing.mjs";
import path from "path";
import { fileURLToPath } from "url";
import { cookieParser } from "cookie-parser";
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { userModel } from "./models/userModel.mjs";
import jwt from "jsonwebtoken";
const tokenJWT = jwt.sign({ userid: 1 }, "1234");
console.log(tokenJWT)
/**
 * Point d'entrée de l'application
 * Vous déclarer ici les routes de votre API REST
 */
async function main() {

    // petit util pour __dirname en ES modules :
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    try {
        const { User, Post, Comment } = await initEntities();
        const userController = new userModel(User);
        const app = express();
        Routes(userController)(app, "/users");
        // Route qui renvoie la page HTML d’inscription
        app.get("/register", (req, res) => {
            res.sendFile(path.join(__dirname, "views", "register.html"));
        });
        app.get("/", (req, res) => {
            res.send("Hello world !");
        });
        console.log(listEndpoints(app));

        app.listen(3000, () => {
            console.log("Serveur démarré sur http://localhost:3000");
        });
    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
// main();