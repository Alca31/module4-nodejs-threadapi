import { loadSequelize } from "../database.mjs";
import { loadUserEntity } from "../models/userEntity.mjs";
import { loadCommentEntity } from "./commentEntity.mjs";
import { loadPostEntity } from "./postEntity.mjs";

export async function initEntities() {
    const sequelize = await loadSequelize();

    const User = loadUserEntity(sequelize);
    const Post = loadPostEntity(sequelize);
    const Comment = loadCommentEntity(sequelize);

    User.hasMany(Post);
    Post.belongsTo(User);

    User.hasMany(Comment);
    Comment.belongsTo(User);

    Post.hasMany(Comment);
    Comment.belongsTo(Post);

    await sequelize.sync();

    return { sequelize, User, Post, Comment };
}

