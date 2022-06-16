// Necesarios
const express = require('express');
const moment = require('moment');
const { Server: HttpServer } = require('http');
const { Server:IOServer } = require('socket.io');
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const { knexMysql } = require('./options/mariaDB');
const { knexSqLite } = require('./options/sqlite3');

//Funciones Knex
const crud = require('./cruds_knex');

// Puerto y app uses
const PORT = 8090;
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');


let arreglo = [];
let historial = [];
let result = [];

//Verificar si existe una tabla de ese nombre. Si no existe, la crea
knexMysql.schema.hasTable('productos').then(function(exists) {
    if (!exists) {
      return knexMysql.schema.createTable('productos', function(table) {
        table.increments('id').primary();
        table.string('name');
        table.integer('price');
        });
    }else{
        arreglo = crud.getProducts(knexMysql);
    }
});

knexSqLite.schema.hasTable('chat').then(function(exists) {
    if (!exists) {
      return knexSqLite.schema.createTable('chat', function(table) {
        table.string('name');
        table.string('time');
        table.string('message');
        });
    }else{
        historial = crud.getChat(knexSqLite);
    }
});


//---------------------------------------------------------------------------------------

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
app.get('/deleteproduct', async (req, resp) =>{
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
    socket.on('new-message', async data => {
        let fecha = moment().format('MMMM Do YYYY, h:mm a');
        data.time = fecha
        crud.insertChat(knexSqLite,data.name,data.time,data.message);
        historial = await crud.getChat(knexSqLite)
        io.sockets.emit('messages', historial);
    })

    //showProducts
    socket.on('show-products', async (data) => {
        

        if(data.id != undefined){
            let found = await crud.getProductsId(knexMysql,data.id);
            if(found!=undefined){
                result = found;
                console.log(result);
            }
            else{
                result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
            };
        }

        if(data.id==''){
            result=await crud.getProducts(knexMysql);
            console.log(result);
        }
        io.sockets.emit('products', result);
    })

    //-------------Agregar Productos
    socket.on('add-products', async data => {
        //requiere un req.body para interactuar
        const newProduct = data;
        let arr = (await crud.getProducts(knexMysql))
 
        //cambiamos el valor del id ingresado por uno que sea +1 que el id del ultimo producto ingresado
        if(arr.length <= 0){
            newProduct.id=1
        }else{
            newProduct.id=parseInt((parseInt(arr[arr.length-1].id))+1);
        }
        //actualizamos el array y lo mostramos
        await crud.insertProducts(knexMysql,newProduct.name,newProduct.price,newProduct.id)
        result = [newProduct];
        io.sockets.emit('addProducts', result);
    })

    //Modificar productos
    socket.on('modify-product', async data => {
        //Definimos una constante con el producto ingresado
        const updateProduct =  data;

        found = await crud.updateProducts(knexMysql,updateProduct.id,updateProduct.name,updateProduct.price);
        console.log(found)
        if(found == 1){
                result = [updateProduct]
        }
        else{
            //si no existe, manda error
            result=[{id:"error", name:"producto no encontrado", price:"-"}]
        }
        io.sockets.emit('modifyProducts', result);
    })

    //Eliminar productos
    socket.on('delete-product', async data => {
        //se busca el producto en cuestion
        
        let found = await crud.getProductsId(knexMysql,data.id);

        if(found != 0 && data.confirmation == "SI"){
            await crud.deleteProducts(knexMysql, await data.id);
            result=found
        }
        else if(found != 0 && data.confirmation != "SI"){
            result=[{name:"no se emitió palabra de confirmación"}]
        }
        else{
            //si no lo encuentra, manda error
            result=[{id:"error", name:"producto no existe", price:"-"}]
        }
        io.sockets.emit('deleteProducts', result);
    })
})


httpServer.listen(PORT, () => {
    console.log(`SERVER ON en http://localhost:${PORT}` );
});




