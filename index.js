import express from 'express';
import fileUpload from "express-fileupload";
// import ventaRouter from './routes/venta.routes.js';
import { ventasController } from './controllers/ventas.controller.js';
import path from 'path';
import { verifyTokenJWT } from './middlewares/jwt.middleware.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,  'public')));


//login
app.post('/login', ventasController.login);
app.get('/login', (req, res)=>{
    res.sendFile('/login.html');
});
app.post('/register', ventasController.login);
app.get('/register', (req, res)=>{
    res.sendFile('/register.html');})


app.get('/', (req, res)=>{
    res.sendFile('index.html');
});

app.listen(PORT, ()=>{
    console.log(`Server up on http://localhost:${PORT}`);
})