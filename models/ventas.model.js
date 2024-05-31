import { pool } from '../database/connection.database.js'


const findEmail = async (email) => {
    const query = {
        text: `
            SELECT * FROM usuarios
            WHERE EMAIL = $1
        `,
        values: [email]
    }
    const { rows } = await pool.query(query)
    return rows[0]}

const create = async({username, email, password, tipo_usuario = false}) =>{
    const query = {
        text: `INSERT INTO usuarios(username, email, password, tipo_usuario)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`,
        values: [username, email, password, tipo_usuario]
    }

    const { rows } = await pool.query(query);
    return rows[0];
}


export const ventasModel = {
    findEmail,
    create
}