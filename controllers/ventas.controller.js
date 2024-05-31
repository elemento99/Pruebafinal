import { ventasModel } from '../models/ventas.model.js'

import jwt from 'jsonwebtoken'
import path from 'path';
const __dirname = import.meta.dirname;

const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await ventasModel.findEmail(email);

        if(!user){
            throw {
                code: 400,
                msg: "Email no registrado!"
            };
        }

        if(password != user.password){
            throw {
                code: 401,
                msg: "Contraseña invalida!"
            };
        }

        const token = jwt.sign(
            {email: user.email},
            process.env.SECRET_JWT,
            { expiresIn: "1h"}
        );
        //res.cookie('token', token, {httpOnly: true});
        return res.cookie('token', token, {httpOnly: true}).json({token, email: user.email});

    } catch (error) {
        console.error(error);
        const { code, msg } = error;
        return res.status(code).json({ok: false, msg});
    }
}
const register = async(req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log({ username, email, password });

        const existingUser = await ventasModel.findEmail(email);
        if (existingUser) {
            throw { code: 400, msg: 'El usuario ya existe!' };
        }

        const user = await ventasModel.create({ username, email, password });

        const token = jwt.sign(
            { email: user.email },
            process.env.SECRET_JWT,
            { expiresIn: '1h' }
        );
        return res.cookie('token', token, { httpOnly: true }).json({ token, email: user.email });
    } catch (error) {
        console.error(error);

   
        const statusCode = error.code >= 100 && error.code < 600 ? error.code : 500; // 
        const errorMsg = error.msg || 'Internal Server Error';

        return res.status(statusCode).json({ ok: false, msg: errorMsg });
    }
};

const registerProduct=async(req, res) => {
    try {
        const { nombre, descripcion, precio,categoria_id } = req.body;
    
        const fotofake= "fotofake"
        console.log({ nombre, descripcion, precio, fotofake ,categoria_id })
        // const foto = req.files.foto
        // let pictureFile = foto;
        // let uploadPath = path.join(__dirname, '../public/imgs/', pictureFile.name);
        
        // pictureFile.mv(uploadPath, (err) => {
        //     if(err){
        //         throw { code: 500, msg: err}
        //     }
        // })
        const product = await ventasModel.createProduct({ nombre, descripcion, precio, imagen_url: fotofake, categoria_id });
        console.log(product);
        return res.status(201).json({ ok: true, product });
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});
    }
}

const getAllProducts = async(req, res) =>{
    try {
        const productos = await ventasModel.allProducts();
        return res.json({productos});
    } catch (error) {
        console.error(error);
        return res.status(error.code).json({ok: false, msg: error.msg});   
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id; 
        const product = await ventasModel.removeProduct(productId);
        return res.json({ ok: true, product });
    } catch (error) {
        console.error(error);
        return res.status(error.code || 500).json({ ok: false, msg: error.msg || 'Internal server error' });
    }
};

const productById = async (req, res) => {
    try {
        const productId = req.params.id; 
        const producto = await ventasModel.productById(productId); 
        if (!producto) {
            return res.status(404).json({ ok: false, msg: 'Producto no encontrado' });
        }
        return res.json({ ok: true, producto });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });   
    }
}


export const ventasController = {
login,
register,
registerProduct,
getAllProducts,
deleteProduct,
productById
}
