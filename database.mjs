import { Sequelize, DataTypes } from "sequelize";

/**
 * 
 * @returns {Promise<Sequelize>}
 */
export async function loadSequelize() {
    const DBNAME = "app-database";
    const DB_USER_NAME = "root";
    const DBPSSwRD = "root";
    const HOST = "127.0.0.1";
    const DIALECT = "mysql";
    try {
        const sequelize = new Sequelize(
            DBNAME,
            DB_USER_NAME, 
            DBPSSwRD, 
        {
            host: HOST,
            dialect: DIALECT
        });


        // ...
        return sequelize;
    } catch (error) {
        console.error(error);
        throw Error("Échec du chargement de Sequelize");
    }

    // ...

}