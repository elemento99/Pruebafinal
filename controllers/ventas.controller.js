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

        // Asignar un código de estado HTTP válido
        const statusCode = error.code >= 100 && error.code < 600 ? error.code : 500; // Default to 500 if no valid code is specified
        const errorMsg = error.msg || 'Internal Server Error';

        return res.status(statusCode).json({ ok: false, msg: errorMsg });
    }
};


export const ventasController = {
login,
register
}
