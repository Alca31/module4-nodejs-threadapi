import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../app.mjs";
export class userController {

    /**
     * 
     * @param {import("sequelize").ModelCtor} User 
     */
    constructor(User) {
        this.User = User;
    }

    async userNameExists(userName) {
        try 
        {
            const user = await this.User.findOne({ where: { userName } });
            return user ?? false;
        } catch (error) 
        {
            return res.status(500).json({ error: error.message });
        }

    }

    async userEmailExists(email) {
        try 
        {
            const checkemail = await this.User.findOne({ where: { email } });
            return checkemail ?? false;
        } catch (error) 
        {
          return res.status(500).json({ error: error.message });
        }

    }

    async create(req, res) {
        try {
            const { userName, email, password } = req.body;
            if (!userName || !email || !password) { return res.status(400).json({ message: "il manque un champs, nom ou email ou mot de passe" }) }
            if (await this.userNameExists(userName)) { return res.status(400).json({ message: "userName déjà pris" }); }
            if (await this.userEmailExists(email)) { return res.status(400).json({ message: "email déjà utilisé" }); }

            const user = await this.User.create({ userName, email, password });
            return res.status(201).json({ message: "Utilisateur créé", user });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getAll(req,res) {
        const users = await this.User.findAll();
        return res.json(users);
    }

    async getOne(req, res) {
        const user = await this.User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        return res.json(user);
    }

    async userLogin(req, res) {
        const { userName, email, password } = req.body;
        if (!password || (!userName && !email)) { return res.status(400).json({ message: "il manque un champs, nom, email ou mot de passe" }) }

        const user = await this.userNameExists(userName) || await this.userEmailExists(email);
        const checkpassword = user.validPassword(password);
        if (user && checkpassword) {
            console.log("secret_pass:", JWT_SECRET);
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '4h' });
            res.cookie('token', token, { httpOnly: true, samesite: "lax", secure: false });//en prod il faut changer false en true
            return res.json(user);
        }
        else { return res.status(404).json({ error: "Utilisateur non trouvé" }); }
    }

    async getUserbyNameorMail(req, res) {
        const { userName, email } = req.body;
        if (!userName && !email) {
            return res.status(400).json({ message: "il manque un champs, nom ou email" })
        }
        const user = await this.userNameExists(userName) || await this.userEmailExists(email);
        if (!user) { return res.status(404).json({ error: "Utilisateur non trouvé" }); }
        return res.json(user);

    }

    logout(req, res) {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    }

    async update(req, res) {
        try {
            const { userName, email, password } = req.body;
            const user = await this.User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

            await user.update({ userName, email, password });
            res.json({ message: "Utilisateur mis à jour", user });
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    }

    async remove(req, res) {
        const deleted = await this.User.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: "Utilisateur non trouvé" });

        res.json({ message: "Utilisateur supprimé" });
    }
}

