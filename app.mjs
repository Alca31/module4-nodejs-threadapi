import dotenv from "dotenv";
import { userRoute } from "./userRouter.mjs";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { userController } from "./controllers/userController.mjs";
import { initEntities } from "./entities/initEntity.mjs";
dotenv.config();
export const JWT_SECRET=process.env.JWT_SECRET ?? "chutfautpasledire";
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
        const user = new userController(User);
        const app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use("/users",userRoute(user));
        // Route qui renvoie la page HTML d’inscription
        // app.get("/index", (req, res) => {
        //     res.sendFile(path.join(__dirname, "views", "register.html"));
        // });
        // app.get("/hello", (req, res) => {
        //     //const user=userController.getAll();
        //     res.send("Hello world !");

        // });
        console.log(listEndpoints(app));

        app.listen(3000, () => {
            console.log("Serveur démarré sur http://localhost:3000");
        });
    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
main();