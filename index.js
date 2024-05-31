import express from 'express';
import fileUpload from "express-fileupload";
// import ventaRouter from './routes/venta.routes.js';
import { ventasController } from './controllers/ventas.controller.js';
import path from 'path';
import { verifyTokenJWT } from './middlewares/jwt.middleware.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.use(fileUpload());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,  'public')));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname,  'public', '/home.html'))})

//login
app.post('/login', ventasController.login);
app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname,  'public', '/login.html'))})


//register
app.post('/register', ventasController.register);
app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname,  'public', '/register.html'))})


//rutas necesarias para todos
app.get('/todosproductos', ventasController.getAllProducts)
app.get('/productos/:id', ventasController.productById)


//rutas para usuarios normales
app.get('/productos', (req, res)=>{
    res.sendFile(path.join(__dirname,  'public', '/productos.html'))})


app.get('/compras', (req, res)=>{
    res.sendFile(path.join(__dirname,  'public', '/carritocompras.html'))})

//rutas solo para admin
app.get('/adminproductos', (req, res)=>{
    res.sendFile(path.join(__dirname,  'public', '/adminproduct.html'))
})

app.post('/productos/nuevo', ventasController.registerProduct);


app.delete('/adminproductos/:id', ventasController.deleteProduct);




app.listen(PORT, ()=>{
    console.log(`Server up on http://localhost:${PORT}`);
})