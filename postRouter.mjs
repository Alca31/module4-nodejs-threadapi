import { Op } from "sequelize";
import { auth } from "./auth.mjs";
import express from "express";

export function postRoute(PostModel, UserModel, CommentModel) {
    const router = express.Router();

    router.get("/all", async (req, res) => {
        const post = await PostModel.findAll(
            {
                include:
                {
                    model: CommentModel,
                    as: 'comments',
                    required: false,
                }
            });
        return res.json(post) || res.status(404).json({ error: "aucun post trouvé" });
    });
    router.get("specific/:id", async (req, res) => {
        const { postID } = req.params;
        const post = await PostModel.findByPk(postID, {
            include: {
                model: CommentModel,
                as: 'comments',
                required: false,
            }
        });
        return res.json(post) || res.status(404).json({ error: "aucun post trouvé" });
    });
    router.get("titled/:title", async (req, res) => {
        const { title } = req.params || req.body;
        if (!title) { return res.status(404).json({ error: "champs titre vide" }); }
        const post = await PostModel.findOne({
            where: { title: title },
            include:
            {
                model: CommentModel,
                as: 'comments',
                required: false,
            }
        });
        return res.json(post) || res.status(404).json({ error: "post non trouvé" });
    });
    router.get(`wroteby/:userName`, async (req, res) => {
        const { userName } = req.params || req.body;

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
        const userID = req.user.id;
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        const post = await PostModel.findAll({
            where: { UserID: userID },
            include:
            {
                model: CommentModel,
                as: 'comments',
                required: false,
            }
        });
        return res.json(post) || res.status(404).json({ error: "post non trouvé" });
    });

    router.post("/write", auth, async (req, res) => {
        try {
            const { title, content } = req.body;
            if (!title || !content) { return res.status(400).json({ error: "Le titre et le contenu sont requis" }); }
            const post = await PostModel.create({ title, content, UserID: req.user.id });
            return res.json(post) || res.status(404).json({ error: "post non mis à jour" });
        } catch (error) {

        }

    });
    router.put("/:id", auth, async (req, res) => {
        try {
            const { title, content } = req.body;
            if (!title || !content) { return res.status(400).json({ error: "Le titre et le contenu sont requis" }); }
            const post = await PostModel.findByPk(req.params.id);
            if (!post) { return res.status(404).json({ error: "post non trouvé" }) };
            if (req.user.id != post.UserID) { return res.status(404).json({ error: "unauthorized" }); };
            await post.update({ title, content });
            res.json({ message: "post mis à jour", post });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    });
    router.delete("/:id", auth, async (req, res) => {
        try {
            const post = await this.PostModel.findByPk(req.params.id);
            if (req.user.id != post.UserID) { return res.status(404).json({ error: "unauthorized" }); };
            const deleted = await PostModel.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ error: "post non trouvé" });

            res.json({ message: "post supprimé" });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    });
    return router;
}