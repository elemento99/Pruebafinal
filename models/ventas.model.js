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

const createProduct= async({nombre, descripcion, precio, imagen_url,categoria_id}) =>{
    const query = {
        text: `INSERT INTO productos(nombre, descripcion, precio, imagen_url,categoria_id)
                VALUES ($1, $2, $3, $4,$5)
                RETURNING *;`,
        values: [nombre, descripcion, precio, imagen_url,categoria_id]
    }

    const { rows } = await pool.query(query);
    return rows[0];
}

const allProducts = async () => {
    const query = {
        text: `SELECT * FROM productos ORDER BY precio LIMIT 10;`,
        values: []
    }

    const { rows } = await pool.query(query);
    return rows;
}

const productById = async (productId) => {
    const query = {
        text: `SELECT * FROM productos WHERE id = $1;`,
        values: [productId]
    };

    const { rows } = await pool.query(query);
    return rows[0]; 
};


const removeProduct = async(id)=>{
    const query = {
        text: `DELETE FROM productos WHERE id = $1 RETURNING *;`,
        values: [id]
    }

    const { rows } = await pool.query(query);
    return rows[0];
}


export const ventasModel = {
    findEmail,
    create,
    createProduct,
    allProducts,
    removeProduct,
    productById
}