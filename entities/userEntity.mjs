import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
//len: fonction sequelize qui verifie la longueur
export function loadUserEntity(sequelize) {
    try {
        const User = sequelize.define("User", {
            userName:
            {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate:
                {
                    len: [3, 75],
                },
            },
            email:
            {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate:
                {
                    len: [3, 125],
                    isEmail: true,
                },
            },
            password:
            {   
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [8, 125],
                },
                set(value){
                    this.setDataValue("password",bcrypt.hashSync(value,10))
                },
            },
        })

        // Hash du mot de passe AVANT création
        /*User.addHook("beforeCreate", async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        });

        // Hash du mot de passe AVANT mise à jour
        User.addHook("beforeUpdate", async (user) => {
            if (user.changed("password")) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        });
        */
        //validation du pass
        User.prototype.validPassword = async function (password) {
            return bcrypt.compare(password, this.password);
        };
        return User;

    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}