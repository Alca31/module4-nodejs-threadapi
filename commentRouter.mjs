import { Op } from "sequelize";
import { auth } from "./auth.mjs";
import express from "express";

export function commentRoute(CommentModel, UserModel, PostModel) {
    const router = express.Router();

    router.get("/all", auth, async (req, res) => {
        const comment = await CommentModel.findAll();
        //si pas admin bloquer la route à coder
        return res.json(comment) || res.status(404).json({ error: "aucun commentaire trouvé" });
    });
    router.get("/specific/:id", async (req, res) => {
        const comment = await CommentModel.findByPk(req.params.id);
        return res.json(comment) || res.status(404).json({ error: "commentaire non trouvé" });
    });
    router.get("/titled/:title", async (req, res) => {
        const { title } = req.params??req.body;
        const comment = await CommentModel.findOne({ where: { title: title } });
        return res.json(comment) || res.status(404).json({ error: "commentaire non trouvé" });
    });
    router.get(`/wroteBy/:userName/:postID`, auth, async (req, res) => {
        const { userName, postID } = req.params??req.body;

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
        const comment = await CommentModel.findAll({ where: { UserID: userID, PostID: postID } });
        return res.json(comment) || res.status(404).json({ error: "commentaire non trouvé" });
    });

    router.post("write/:postID",auth, async (req, res) => {
        try {
            const { title, content, sentPostID} = req.body;
            const userID= req.user.id;
            const postID= req.params??sentPostID;
            if (!title || !content) {return res.status(400).json({ error: "Le titre et le contenu sont requis" });}
            await comment.create({ title, content, userID, postID });
            return res.json(comment) || res.status(404).json({ error: "commentaire non mis à jour" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    });
    router.put("/:id", auth, async (req, res) => {
        try {
            const { title, content } = req.body;
            const comment = await CommentModel.findByPk(req.params.id);
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
            if (!deleted) return res.status(404).json({ error: "commentaire non trouvé" });

            res.json({ message: "commentaire supprimé" });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    });
    return router;
}