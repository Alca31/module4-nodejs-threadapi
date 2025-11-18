import { DataTypes } from "sequelize";
//len: fonction sequelize qui verifie la longueur
export function loadCommentEntity(sequelize) {
    try {
        const Comment = sequelize.define("Comment", {
            content:
            {
                type: DataTypes.STRING,
                allowNull: false,
                validate:
                {
                    len: [1, 125],
                },
            },
            createdAt:
            {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,//fait automatiquement de base
            },
        })
        return Comment;

    } catch (error) {
        console.error("Error de chargement de Sequelize:", error);
    }
}