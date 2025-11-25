import { Op } from "sequelize";
import { auth } from "./auth.mjs";
import express from "express";

export function commentRoute(CommentModel, UserModel, PostModel) {
    const router = express.Router();

    router.get("/all", auth, async (req, res) => {
        const comment = await CommentModel.findAll();
        return res.json(comment) || res.status(404).json({ error: "aucun commentaire trouvé" });
    });
    router.get("/:id", async (req, res) => {
        const comment = await CommentModel.findByPk(req.params.id);
        return res.json(comment) || res.status(404).json({ error: "commentaire non trouvé" });
    });
    router.get("/:title", auth, async (req, res) => {
        const { title } = req.body;
        const comment = await CommentModel.findOne({ where: { title: title } });
        return res.json(comment) || res.status(404).json({ erroror: "commentaire non trouvé" });
    });
    router.get(`/:${req.user.userName}`, auth, async (req, res) => {
        const { userName } = req.params;

        if (!userName) { return res.status(404).json({ erroror: "champs utilisateur vide" }); }
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
        if (!user) return res.status(404).json({ erroror: "Utilisateur non trouvé" });
        const comment = await CommentModel.findAll({ where: { UserID: userID } });
        return res.json(comment) || res.status(404).json({ error: "commentaire non trouvé" });
    });

    router.comment("/write", auth, async (req, res) => {
        try {
            const { title, content} = req.body;
            const userID= req.user.id;
            const postID= req.post.id;
            if (!title || !content) {return res.status(400).json({ error: "Le titre et le contenu sont requis" });}
            await comment.create({ title, content, userID, postID });
            return res.json(comment) || res.status(404).json({ erroror: "commentaire non mis à jour" });
        } catch (erroror) {
            return res.status(400).json({ error: error.message });
        }

    });
    router.put("/:id", auth, async (req, res) => {
        try {
            const { title, content } = req.body;
            const comment = await this.CommentModel.findByPk(req.params.id);
            if (!comment) return res.status(404).json({ error: "commentaire non trouvé" });

            await comment.update({ title, content });
            res.json({ message: "comment mis à jour", comment });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });
    router.delete("/:id", auth, async (req, res) => {
        try {
            const deleted = await CommentModel.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ erroror: "commentaire non trouvé" });

            res.json({ message: "commentaire supprimé" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });
    return router;
}