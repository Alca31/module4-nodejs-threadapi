import jwt from "jsonwebtoken";
export class userController {

    /**
     * 
     * @param {import("sequelize").ModelCtor} User 
     */
    constructor(User) {
        this.User = User;
    }

    async userNameExists(userName) {
        const user = await this.User.findOne({ where: { userName } });
        return user ?? false;
    }

    async userEmailExists(email) {
        const count = await this.User.findOne({ where: { email } });
        return email ?? false;
    }

    async create(req, res) {
        try {
            const { userName, email, password } = req.body;
            if (!userName || !email || !password) {
                return res.status(400).json({ message: "il manque un champs, nom ou email ou mot de passe" })
            }

            if (await this.userNameExists(userName)) {
                return res.status(400).json({ message: "userName déjà pris" });
            }
            if (await this.userEmailExists(email)) {
                return res.status(400).json({ message: "email déjà utilisé" });
            }

            const user = await this.User.create({ userName, email, password });
            return res.status(201).json({ message: "Utilisateur créé", user });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    async getAll() {
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
        if (!password||(!userName && !email)) { return res.status(400).json({ message: "il manque un champs, nom, email ou mot de passe" }) }
        const user = await userNameExists(userName);
        const checkemail = await this.userEmailExists(email);
        const checkpassword = user.User.validpassword(password);
        if ((user || checkemail) && checkpassword) {
            const secret_key = "chutfautpasledire";
            const secret_pass = process.env.JWT_SECRET || secret_key;
            const token = jwt.sign({ userId: user.id }, secret_pass, { expiresIn: '4h' });
            res.cookie('token', token, { httpOnly: true, samesite: "lax", secure: false });//en prod il faut changer false en true
            return res.json(user??checkemail);
        }
        else { return res.status(404).json({ error: "Utilisateur non trouvé" }); }
    }

    async getUserbyNameOrMail(req, res) {
        const { userName, email } = req.body;
        if (!userName || !email) {
            return res.status(400).json({ message: "il manque un champs, nom ou email" })
        }
        const user = await this.userNameExists(userName);
        const checkemail = await this.userEmailExists(email);
        if (!user && !checkemail) { return res.status(404).json({ error: "Utilisateur non trouvé" }); }
        else {
            if (user) {return res.json(user);}
            return res.json(checkemail);
        }
    }

    async update(req, res) {
        try {
            const { userName, email, password } = req.body;
            const user = await this.User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

            await user.update({ userName, email, password });
            res.json({ message: "Utilisateur mis à jour" });
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

