const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const DB_MENSAJE =[];
const DB_PRODUCTOS = [];


const routerProductos = require("./src/routes/productos.routes.js");

// /*-------------------Middleware-------------------------*/
app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));

//Motor de plantillas
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('socketio', io);

// /*-------------------Rutas-------------------------*/
app.use("/", routerProductos);

/* ---------------------- WebSocket ----------------------*/
io.on('connection', (socket)=>{

    console.log(`Nuevo cliente conectado! ${socket.id}`);

    socket.emit('from-server-mensajes', {DB_MENSAJE});

    socket.on('from-client-mensaje', mensaje => {
        DB_MENSAJE.push(mensaje);
        io.sockets.emit('from-server-mensajes', {DB_MENSAJE});
    });
    
    socket.emit('from-server-producto', {DB_PRODUCTOS});

    socket.on('from-client-producto', producto => {
        DB_PRODUCTOS.push(producto);
        io.sockets.emit('from-server-producto', {DB_PRODUCTOS});
    });
    
  });
  
/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
});
server.on('error', err => console.log(`error en server ${err}`));


