import { DataTypes } from "sequelize";
//len: fonction sequelize qui verifie la longueur
export function loadPostEntity(sequelize) {
    try {
        const Post = sequelize.define("Post", {
            title:
            {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [3, 75],
                },
            },
            content:
            {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [3, 125],
                },
            },
            createdAt:
            {   
                allowNull:false,
                type: DataTypes.DATE,
                defaultValue:DataTypes.NOW,//fait automatiquement de base
            },
        })
        return Post;

    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}
