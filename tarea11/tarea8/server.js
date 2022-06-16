// Necesarios
const express = require('express'); // Importa el módulo express
const { Server: HttpServer } = require('http'); // Importar el modulo http
const { Server: IOServer } = require('socket.io'); // Importar socket.io
const app = express(); // Crea una instancia de express
const httpServer = new HttpServer(app);     // Crea el servidor http
const io = new IOServer(httpServer);   // Crea un servidor de sockets
const { schema, normalize, denormalize } = require('normalizr'); // normalizr
const util = require('util')    // util es una libreria que nos permite hacer una copia de un objeto
const fs = require('fs'); // file system


// Puerto y app uses
const PORT = 8080; 
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//Faker
let faker = require('faker');
faker.locale = 'es';
const { commerce } = faker;

//Print products util 
function print(objeto) {
    return(util.inspect(objeto, false, 12, true));
}

const text= new schema.Entity('text');

const author = new schema.Entity('author');

const mensajes = new schema.Entity('mensajes',{
    author:author,
    text:text
});

const historialMsg = new schema.Entity('historialMsg', {
    historial:[mensajes]
})


let arreglo = [];
let historial = [];
let result = [];

const fakeProducts = () => {
    for (let i = 0; i < 5; i++) {
        arreglo.push({
            id: i + 1,
            name: `${faker.commerce.productName()}`,
            price: `${faker.commerce.price()}`

        })
    }
}

fakeProducts();




//---------------------------------------------------------------------------------------

app.get("/", (req, resp) => {
    resp.render("pages/index")
});

//GET: Devuelve todos los productos
app.get('/productoshtml', (req, resp) => {
    resp.render('pages/productoshtml');
});

//POST: agrega un producto
app.get('/agregarproductos', (req, resp) => {
    resp.render("pages/addproduct");
})

//POST: modifica un producto
app.get('/productomod', (req, resp) => {
    resp.render("pages/modifyproduct");
})


//POST: Elimina un producto por su id
app.get('/deleteproduct', async (req, resp) => {
    resp.render("pages/delete");
})

// GET: Chat app
app.get('/chat', (req, resp) => {
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
        let normalData = {author:{nombre:data.nombre, apellido:data.apellido, edad:data.edad, alias:data.alias, id:data.id}, text:data.texto};
        historial.push(normalData);
        const normalizeData = normalize(historial, historialMsg);
        fs.writeFileSync('./historialMsg.json', (JSON.stringify(normalizeData)));
        io.sockets.emit('messages', historial);
    })

    //showProducts
    socket.on('show-products', async (data) => {

        if (data.id != undefined) {
            let found = await arreglo.find(x => x.id == parseInt(data.id));
            console.log(found)
            if (found != undefined) {
                result = [found];
                console.log(result);
            }
            else {
                result = [{ id: "error", name: "producto no encontrado", price: "-" }]
            };
        }

        if (data.id == '') {
            result = arreglo;
            console.log(result);
        }

        io.sockets.emit('products', result);
    })

    //-------------Agregar Productos
    socket.on('add-products', async data => {
        //requiere un req.body para interactuar
        const newProduct = data;
        let arr = arreglo

        //cambiamos el valor del id ingresado por uno que sea +1 que el id del ultimo producto ingresado
        if (arr.length <= 0) {
            newProduct.id = 1
        } else {
            newProduct.id = parseInt((parseInt(arr[arr.length - 1].id)) + 1);
        }
        //actualizamos el array y lo mostramos
        arreglo.push(newProduct);
        result = [newProduct];
        io.sockets.emit('addProducts', result);
    })

    //Modificar productos
    socket.on('modify-product', async data => {
        //Definimos una constante con el producto ingresado
        const updateProduct = data;

        let found = arreglo.find(x => x.id == parseInt(data.id));
        console.log(found)
        if (found != undefined) {
            found.name = updateProduct.name;
            found.price = updateProduct.price;
            found.id = updateProduct.id;
            result = [found];
        }
        else {
            //si no existe, manda error
            result = [{ id: "error", name: "producto no encontrado", price: "-" }]
        }
        io.sockets.emit('modifyProducts', result);
    })

    //Eliminar productos
    socket.on('delete-product', async data => {
        //se busca el producto en cuestion

        let found = arreglo.find(x => x.id == data.id);
        let confirmation = data.confirmation

        if(found != undefined && confirmation == "SI"){
            //si lo encuentra, definimos su "index"
            let index = parseInt(arreglo.indexOf(found))
            //lo sacamos por su numero de index
            arreglo.splice(index,1)
            //mostramos el arreglo actualizado
            result=[found];
        }
        else if (found != 0 && data.confirmation != "SI") {
            result = [{ name: "no se emitió palabra de confirmación" }]
        }
        else {
            //si no lo encuentra, manda error
            result = [{ id: "error", name: "producto no existe", price: "-" }]
        }
        io.sockets.emit('deleteProducts', result);
    })
})


httpServer.listen(PORT, () => {
    console.log(`SERVER ON en http://localhost:${PORT}`);
});




