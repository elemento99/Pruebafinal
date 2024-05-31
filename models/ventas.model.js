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


export const ventasModel = {
    findEmail
}