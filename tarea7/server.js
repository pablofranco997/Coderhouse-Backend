// Necesarios
const express = require('express');
const moment = require('moment');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const fs = require('fs');
const { stringify } = require('querystring');

// Puerto y app uses
const PORT = 8050;
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// Data transform
let datatxt = fs.readFileSync('./historialMsg.json', 'utf-8');
let dataproducts = fs.readFileSync('./products.json', 'utf-8');

// If's necesarios
let historial = [];
if(datatxt==""){
    historial = [];
}else{
    historial = JSON.parse(datatxt);
}

let arreglo = [];
if(dataproducts==""){
    arreglo = [];
}else{
    arreglo = JSON.parse(dataproducts);
}

let result = [];
//--------apps GET,POST para HTML--------

//GET: Index
app.get("/", (req,resp) => {
    resp.render("pages/index")
});

//GET: Devuelve todos los productos
app.get('/productoshtml', (req, resp) => {
    resp.render('pages/productoshtml');
});

//POST: agrega un producto
app.get ('/agregarproductos',(req, resp) => {
    resp.render("pages/addproduct");
})

//POST: modifica un producto
app.get ('/productomod',(req, resp) => {
    resp.render("pages/modifyproduct");
})


//POST: Elimina un producto por su id
app.get('/deleteproduct', (req, resp) =>{
    resp.render("pages/delete");
})

// GET: Chat app
app.get('/chat', (req,resp)=>{
    resp.render('pages/chat')
})

// ----------------------Sockets-----------------------
io.on('connection', (socket) => {

    //sockets emit
    console.log('Cliente conectado');
    socket.emit('messages', historial);
    socket.emit('products', result);
    socket.emit('addProducts', result);
    socket.emit('modifyProducts', result);
    socket.emit('deleteProducts', result);

    //Chat app
    socket.on('new-message', data => {
        let fecha = moment().format('MMMM Do YYYY, h:mm:ss a');
        data.date = fecha
        console.log(data)
        historial.push(data);
        fs.writeFileSync('./historialMsg.json', (JSON.stringify(historial)));
        io.sockets.emit('messages', historial);
    })

    //showProducts
    socket.on('show-products', (data) => {
        if(data.id != undefined){
            let found = arreglo.find(x => x.id == parseInt(data.id));

            if(found!=undefined){
                result = [found]
            }
            else{
                result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
            };
        }

        if(data.id==''){
            result=arreglo;
        }
        io.sockets.emit('products', result);
    })

    //-------------Agregar Productos
    socket.on('add-products', data => {
        //requiere un req.body para interactuar
        const newProduct = data;
        //cambiamos el valor del id ingresado por uno que sea +1 que el id del ultimo producto ingresado
        if(arreglo.length <= 0){
            newProduct.id=1
        }else{
            newProduct.id=parseInt((parseInt(arreglo[arreglo.length-1].id))+1);
        }
        //actualizamos el array y lo mostramos
        arreglo.push(newProduct);
        result = [newProduct];
        fs.writeFileSync('./products.json', (JSON.stringify(arreglo)));
        io.sockets.emit('addProducts', result);
    })

    //Modificar productos
    socket.on('modify-product', data => {
        //Definimos una constante con el producto ingresado
        const updateProduct = data;
        //Buscamos el producto por su id
        let found = arreglo.find(x => x.id == parseInt(updateProduct.id));
        if(found != undefined){

            if(updateProduct.nombre == '' | updateProduct.precio == ''){
                result=[{id:"error", nombre:"No introdujiste precio o nombre", precio:"-"}]
            }else{
                //Si el producto existe, cambiamos los valores anteriores con los nuevos
                found.nombre=updateProduct.nombre;
                found.precio=updateProduct.precio;
                found.id=updateProduct.id;
                result = [found]
            }
        }
        else{
            //si no existe, manda error
            result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
        }
        fs.writeFileSync('./products.json', (JSON.stringify(arreglo)));
        io.sockets.emit('modifyProducts', result);
    })

    //Eliminar productos
    socket.on('delete-product', data => {
        //se busca el producto en cuestion
        let found = arreglo.find(x => x.id == data.id);
        let confirmation = data.confirmation

        if(found != undefined && confirmation == "SI"){
            //si lo encuentra, definimos su "index"
            let index = parseInt(arreglo.indexOf(found))
            //lo sacamos por su numero de index
            arreglo.splice(index,1)
            //mostramos el arreglo actualizado
            result=[found]
        }else if(found != undefined && confirmation != "SI"){
            result=[{nombre:"no se emitió palabra de confirmación"}]
        }
        else{
            //si no lo encuentra, manda error
            result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
        }
        fs.writeFileSync('./products.json', (JSON.stringify(arreglo)));
        io.sockets.emit('deleteProducts', result);
    })
})


httpServer.listen(PORT, () => {
    console.log(`SERVER ON en http://localhost:${PORT}` );
});

