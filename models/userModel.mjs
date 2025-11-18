
export class userModel {

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

            if (await userNameExists(userName)) {
                return res.status(400).json({ message: "userName déjà pris" });
            }
            if (await userEmailExists(email)) {
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
        const { userName, password } = req.body;
        if (!userName || !password) {return res.status(400).json({ message: "il manque un champs, nom ou mot de passe" })}
        const user = await userNameExists(userName);
        const checkpassword = user.User.validpassword(password);
        if (user && checkpassword) { return res.json(user); }
        else { return res.status(404).json({ error: "Utilisateur non trouvé" }); }
    }

    async getUserbyNameOrMail(req, res) {
        const { userName, email} = req.body;
        if (!userName || !email) {
            return res.status(400).json({ message: "il manque un champs, nom ou email" })
        }
        const user = await userNameExists(userName);
        const checkemail= await user.validpassword(password);
        if (!user && !checkemail) { return res.status(404).json({ error: "Utilisateur non trouvé" }); }
        else {  }
    }

    async updateUser(req, res) {
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

    async removeUser(req, res) {
        const deleted = await this.User.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: "Utilisateur non trouvé" });

        res.json({ message: "Utilisateur supprimé" });
    }
}

