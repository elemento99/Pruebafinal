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



export const ventasController = {
login
}
