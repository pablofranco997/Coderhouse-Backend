const { urlencoded } = require('express');
const express = require('express');
const { Router } = express;

const app = express();
const router = Router();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api', router);
app.use(express.static('public'));
app.use('/custom/url', express.static(__dirname + '/public'));

const arreglo = [{nombre:"taco",precio:15,id:1},{nombre:"pizza",precio:120,id:2}]


//--------Routers GET,POST para HTML--------

//GET: Devuelve todos los productos
router.get('/productoshtml', (req, resp) => {
    if(req.query.id != undefined){
        let found = arreglo.find(x => x.id == parseInt(req.query.id));
        if(found!=undefined){
            resp.json(found)
        }
        else{
            resp.json({"error":"producto no encontrado"})
        }
    }else if(req.query={}){
        resp.json(arreglo);
    }
});

//POST: agrega un producto
router.post('/productoshtml', (req, resp) => {
    //requiere un req.body para interactuar
    const newProduct = req.body;
    //cambiamos el valor del id ingresado por uno que sea +1 que el id del ultimo producto ingresado
    if(arreglo.length <= 0){
        newProduct.id=1
    }else{
        newProduct.id=parseInt((parseInt(arreglo[arreglo.length-1].id))+1);
    }
    //actualizamos el array y lo mostramos
    arreglo.push(newProduct);
    resp.json(arreglo);
})

//POST: modifica un producto
router.post('/productomod', (req, resp) =>{
    //Definimos una constante con el producto ingresado
    const updateProduct = req.body;
    //Buscamos el producto por su id
    let found = arreglo.find(x => x.id == parseInt(req.body.id));
    if(found != undefined){
        //Si el producto existe, cambiamos los valores anteriores con los nuevos
        found.nombre=updateProduct.nombre;
        found.precio=updateProduct.precio;
        found.id=updateProduct.id;
        // se muestra el nuevo arreglo con el producto modificado
        resp.json(found);
    }else{
        //si no existe, manda error
        resp.json({'error':'producto no encontrado'});
    }
})

//POST: Elimina un producto por su id
router.post('/deleteproduct', (req, resp) =>{
    //se busca el producto en cuestion
    let found = arreglo.find(x => x.id == req.body.id);
    let confirmation = req.body.confirmation

    if(found != undefined && confirmation == "SI"){
        //si lo encuentra, definimos su "index"
        let index = parseInt(arreglo.indexOf(found))
        //lo sacamos por su numero de index
        arreglo.splice(index,1)
        //mostramos el arreglo actualizado
        resp.json(found)
    }else if(found != undefined && confirmation != "SI"){
        resp.json("No emitió palabra de confirmación")
    }
    else{
        //si no lo encuentra, manda error
        resp.json({'error':'producto no encontrado'});
    }
})



//--------Routers GET,POST para POSTMAN--------
//GET: Devuelve todos los productos
router.get('/productos', (req, resp) => {
    resp.json(arreglo);
});

//GET: Devuelve por id
router.get('/productos/:id', (req, resp) => {
    //Encuentra el producto
    let found = arreglo.find(x => x.id == req.params.id);

    if(found != undefined){
        //Si found tiene un resultado, lo muestra
        resp.json(found);
    }else{
        //Si no, muestra el error
        resp.json({'error':'producto no encontrado'});
    }
});

//POST: agrega un producto
router.post('/productos', (req, resp) => {
    //requiere un req.body para interactuar
    const newProduct = req.body;
    //cambiamos el valor del id ingresado por uno que sea +1 que el id del ultimo producto ingresado
    if(arreglo.length <= 0){
        newProduct.id=1
    }else{
        newProduct.id=parseInt((parseInt(arreglo[arreglo.length-1].id))+1);
    }
    //actualizamos el array y lo mostramos
    arreglo.push(newProduct);
    resp.json(arreglo);
})  

//PUT: modifica un producto
router.put('/productos/:id', (req, resp) =>{
    //Definimos una constante con el producto ingresado
    const updateProduct = req.body;
    //Buscamos el producto por su id
    let found = arreglo.find(x => x.id == req.params.id);
    if(found != undefined){
        //Si el producto existe, cambiamos los valores anteriores con los nuevos
        found.nombre=updateProduct.nombre;
        found.precio=updateProduct.precio;
        found.id=updateProduct.id;
        //se muestra el nuevo arreglo con el producto modificado
        resp.json(arreglo);
    }else{
        //si no existe, manda error
        resp.json({'error':'producto no encontrado'});
    }

})

//DELETE: Elimina un producto por su id
router.delete('/productos/:id', (req, resp) =>{
    //se busca el producto en cuestion
    let found = arreglo.find(x => x.id == req.params.id);

    if(found!=undefined){
        //si lo encuentra, definimos su "index"
        let index = parseInt(arreglo.indexOf(found))
        //lo sacamos por su numero de index
        arreglo.splice(index,1)
        //mostramos el arreglo actualizado
        resp.json(arreglo)
    }else{
        //si no lo encuentra, manda error
        resp.json({'error':'producto no encontrado'});
    }
    
})



const server = app.listen(8080, () => {
    console.log('La aplicacion express esta escuchando');
})
