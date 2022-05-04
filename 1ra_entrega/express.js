//Requirements-------------------------------------------------------------------------------------------

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const { Router } = express;
const router = Router();
const router2 = Router();

app.use('/api/productos', router);
app.use('/api/carrito', router2);

const fs = require('fs');
const { stringify } = require('querystring');

const moment = require('moment');

//------------------------Routers GET, POST, PUT, DELETE para Administrador----------------------------------------

// Data transform
let dataProducts = fs.readFileSync('./json_archives/products.json', 'utf-8');

//Array to Json
let productos = 
[];
if(dataProducts==""){
    productos = [];
}else{
    productos = JSON.parse(dataProducts);
}

//GET: Devuelve todos los productos
router.get('/', (req, resp) => {
    resp.json(productos);
});

//GET: Devuelve por id
router.get('/:id', (req, resp) => {
    //Encuentra el producto
    let found = productos.find(x => x.id == req.params.id);
    
    if(found != undefined){
        //Si found tiene un resultado, lo muestra
        resp.json(found);
    }else{
        //Si no, muestra el error
        resp.json({'error':'producto no encontrado'});
    }
});

//POST: agrega un producto
router.post('/', (req, resp) => {
    //requiere un req.body para interactuar
    const newProduct = req.body;

    if(req.body.nombre == null|req.body.precio==null|req.body.descripcion==null|req.body.codigo==null|req.body.stock==null|req.body.url==null){
        resp.json({'error':'Necesita ingesar los valores correctos', "ejemplo":["nombre:string","precio:number","descripcion:string","codigo:number","stock:number","url:string"]});
    }else{
        if(productos.length <= 0){
        newProduct.id=1;
        newProduct.time = moment().format('MMMM Do YYYY, h:mm:ss a');
        }else{
            newProduct.id=parseInt((parseInt(productos[productos.length-1].id))+1);
            newProduct.time = moment().format('MMMM Do YYYY, h:mm:ss a');
        }
    }
    
    // actualizamos el array y lo mostramos
    productos.push(newProduct);
    fs.writeFileSync('./json_archives/products.json', (JSON.stringify(productos)));
    resp.json(productos);
})

//PUT: modifica un producto
router.put('/:id', (req, resp) =>{
    //Definimos una constante con el producto ingresado
    const updateProduct = req.body;
    //Buscamos el producto por su id
    let found = productos.find(x => x.id == req.params.id);
    if(found != undefined){
        //Si el producto existe, cambiamos los valores anteriores con los nuevos
        found.nombre=updateProduct.nombre;
        found.precio=updateProduct.precio;
        found.id=updateProduct.id;
        //Actualizamos
        fs.writeFileSync('./json_archives/products.json', (JSON.stringify(productos)));
        //se muestra el nuevo productos con el producto modificado
        resp.json(productos);
    }else{
        //si no existe, manda error
        resp.json({'error':'producto no encontrado'});
    }
})

//DELETE: Elimina un producto por su id
router.delete('/:id', (req, resp) =>{
    //se busca el producto en cuestion
    let found = productos.find(x => x.id == req.params.id);
    
    if(found!=undefined){
        //si lo encuentra, definimos su "index"
        let index = parseInt(productos.indexOf(found))
        //lo sacamos por su numero de index
        productos.splice(index,1)
        //Actualizamos
        fs.writeFileSync('./json_archives/products.json', (JSON.stringify(productos)));
        //mostramos el productos actualizado
        resp.json(productos)
    }else{
        //si no lo encuentra, manda error
        resp.json({'error':'producto no encontrado'});
    }
    
})

//------------------------Routers GET, POST, PUT, DELETE para Usuario----------------------------------------

//Data transform
let dataCarts = fs.readFileSync('./json_archives/carts.json', 'utf-8');

//Array to Json
let carts = [];
if(dataCarts==""){
    carts = [];
}else{
    carts = JSON.parse(dataCarts);
}

router2.post('/', (req, resp) => {

    let newCart = {}
    //cambiamos el valor del id ingresado por uno que sea +1 que el id del ultimo producto ingresado
    if(carts.length <= 0){
        newCart.id=1;
        newCart.products=[];
    }else{
        newCart.id=parseInt((parseInt(carts[carts.length-1].id))+1);
        newCart.products=[];
    };
    // actualizamos el array y lo mostramos
    carts.push(newCart);
    fs.writeFileSync('./json_archives/carts.json', (JSON.stringify(carts)));
    resp.json(carts);
})

router2.delete('/:id', (req, resp) => {
    let found = carts.find(x => x.id == req.params.id);
    
    if(found!=undefined){
        //si lo encuentra, definimos su "index"
        let index = parseInt(carts.indexOf(found))
        //lo sacamos por su numero de index
        carts.splice(index,1)
        //Actualizamos
        fs.writeFileSync('./json_archives/carts.json', (JSON.stringify(carts)));
        //mostramos el productos actualizado
        resp.json(carts)
    }else{
        //si no lo encuentra, manda error
        resp.json({'error':'carrito no encontrado'});
    }
})

router2.get('/:id/productos', (req, resp) => {
    let found = carts.find(x => x.id == req.params.id);
    
    if(found!=undefined){
        let index = parseInt(carts.indexOf(found))
        //Si lo encuentra, muestra los products
        resp.json(carts[index])
    }else{
        //si no lo encuentra, manda error
        resp.json({'error':'carrito no encontrado'});
    }
})

router2.post('/:id/productos', (req, resp) => {
    let found = carts.find(x => x.id == req.params.id);
    
    if(found!=undefined){
        let index = parseInt(carts.indexOf(found))
        if(req.body.products != null){
            let productsIds = req.body.products
            for ( let addProducts of productsIds){
                carts[index].products.push((productos.find(x => x.id == addProducts)))
            }
            fs.writeFileSync('./json_archives/carts.json', (JSON.stringify(carts)));
            resp.json(carts[index])
        }else{
            resp.json({'error':'introducir "products" : "array de ids"'});
        }
    }else{
        //si no lo encuentra, manda error
        resp.json({'error':'carrito no encontrado'});
    }
});

router2.delete('/:id/productos/:id_prod', (req, resp) => {
    let foundCart = carts.find(x => x.id == req.params.id);
    
    if(foundCart!=undefined){
        //si lo encuentra, definimos su "index"
        let indexCart = parseInt(carts.indexOf(foundCart));
        let foundProduct = carts[indexCart].products.find(x=> x.id == req.params.id_prod);

        if(foundProduct!=undefined){
            let indexProduct = parseInt(carts[indexCart].products.indexOf(foundProduct))
        //lo sacamos por su numero de index
        carts[indexCart].products.splice(indexProduct,1)
        //Actualizamos
        fs.writeFileSync('./json_archives/carts.json', (JSON.stringify(carts)));
        //mostramos el productos actualizado
        resp.json(carts[indexCart])
        }else{
            resp.json({'error':'producto no existe en esta lista'});
        }
        
    }else{
        //si no lo encuentra, manda error
        resp.json({'error':'carrito no encontrado'});
    }
})


//----------------Redirección NOT FOUND------------------------
app.all('*', function(req, res){
    res.status(404).send({"error":`404`,"descripcion":`ruta ${req.originalUrl} y método ${req.method} no implementados`});
});



const server = app.listen(8080, () => {
    console.log('La aplicacion express esta escuchando: puerto 8080');
})
