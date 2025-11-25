import { Op } from "sequelize";
import { auth } from "./auth.mjs";
import express from "express";

export function postRoute(PostModel, UserModel) {
    const router = express.Router();

    router.get("/all", async (req, res) => {
        const post = await PostModel.findAll();
        return res.json(post) || res.status(404).json({ error: "aucun post trouvé" });
    });
    router.get("/:id", async (req, res) => {
        const post = await PostModel.findByPk(req.params.id);
        return res.json(post) || res.status(404).json({ error: "post non trouvé" });
    });
    router.get("/:title", async (req, res) => {
        const { title } = req.body;
        if (!title) { return res.status(404).json({ error: "champs titre vide" }); }
        const post = await PostModel.findOne({ where: { title: title } });
        return res.json(post) || res.status(404).json({ error: "post non trouvé" });
    });
    router.get(`/:${req.user.userName}`, async (req, res) => {
        const { userName } = req.params;

        if (!userName) { return res.status(404).json({ error: "champs utilisateur vide" }); }
        const user = await UserModel.findOne({
            where:
            {
                userName: userName
                /*[Op.or]: {
                    userName: userName,
                    id: userID
                }*/
            }
        });
        const userID = user.id;
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        const post = await PostModel.findAll({ where: { UserID: userID } });
        return res.json(post) || res.status(404).json({ error: "post non trouvé" });
    });

    router.post("/write", auth, async (req, res) => {
        try {
            
            const { title, content } = req.body;
            if (!title || !content) {return res.status(400).json({ error: "Le titre et le contenu sont requis" });}
            await post.create({ title, content, userID });
            return res.json(post) || res.status(404).json({ error: "post non mis à jour" });
        } catch (error) {

        }

    });
    router.put("/:id", auth, async (req, res) => {
        try {
            const { title, content } = req.body;
            if (!title || !content) {return res.status(400).json({ error: "Le titre et le contenu sont requis" });}
            const post = await this.PostModel.findByPk(req.params.id);
            if (!post) return res.status(404).json({ error: "post non trouvé" });

            await post.update({ title, content });
            res.json({ message: "post mis à jour", post });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    });
    router.delete("/:id", auth, async (req, res) => {
        try {
            const deleted = await PostModel.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: "post non trouvé" });

            res.json({ message: "post supprimé" });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    });
    return router;
}