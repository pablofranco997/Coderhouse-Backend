const { urlencoded } = require('express');
const express = require('express');

const app = express();

app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');

const arreglo = [{nombre:"taco",precio:15,id:1},{nombre:"pizza",precio:120,id:2},{nombre:"hamburguesa",precio:90,id:3}]

//--------apps GET,POST para HTML--------

//GET: Index
app.get("/", (req,resp) => {
    resp.render("pages/index")
});

//GET: Devuelve todos los productos
app.get('/productoshtml', (req, resp) => {
    let result = []
    if(req.query.id != undefined){
        let found = arreglo.find(x => x.id == parseInt(req.query.id));

        if(found!=undefined){
            result = [found]
    
            resp.render('pages/productoshtml', {result: result});
        }

        else{
            result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
            resp.render('pages/productoshtml', {result: result});
        }

    }else if(req.query={}){
        result=arreglo
        resp.render('pages/productoshtml', {result: result});
    }
});

//POST: agrega un producto
app.get ('/agregarproductos',(req, resp) => {
    let result = []
    resp.render("pages/addproduct",{result: result});
})

app.post('/agregarproductos', (req, resp) => {
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
    let result = arreglo;
    
    resp.render("pages/addproduct",{result: result});
})

//POST: modifica un producto
app.get ('/productomod',(req, resp) => {
    let result = []
    resp.render("pages/modifyproduct",{result: result});
})
app.post('/productomod', (req, resp) =>{
    //Definimos una constante con el producto ingresado
    const updateProduct = req.body;
    let result=[]
    //Buscamos el producto por su id
    let found = arreglo.find(x => x.id == parseInt(req.body.id));
    if(found != undefined){
        //Si el producto existe, cambiamos los valores anteriores con los nuevos
        found.nombre=updateProduct.nombre;
        found.precio=updateProduct.precio;
        found.id=updateProduct.id;
        result = [found]
        // se muestra el nuevo arreglo con el producto modificado
        resp.render("pages/modifyproduct",{result: result});
    }else{
        //si no existe, manda error
        result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
        resp.render("pages/modifyproduct",{result: result});
    }
})

//POST: Elimina un producto por su id
app.get ('/deleteproduct',(req, resp) => {
    let result = []
    resp.render("pages/delete",{result: result});
})

app.post('/deleteproduct', (req, resp) =>{
    //se busca el producto en cuestion
    let found = arreglo.find(x => x.id == req.body.id);
    let confirmation = req.body.confirmation
    let result = []

    if(found != undefined && confirmation == "SI"){
        //si lo encuentra, definimos su "index"
        let index = parseInt(arreglo.indexOf(found))
        //lo sacamos por su numero de index
        arreglo.splice(index,1)
        //mostramos el arreglo actualizado
        result=[found]
        resp.render("pages/delete",{result: result});
    }else if(found != undefined && confirmation != "SI"){
        result=[{nombre:"no se emitió palabra de confirmación"}]
        resp.render("pages/delete",{result: result});
    }
    else{
        //si no lo encuentra, manda error
        result=[{id:"error", nombre:"producto no encontrado", precio:"-"}]
        resp.render("pages/delete",{result: result});
    }
})

const server = app.listen(8010, () => {
    console.log('La aplicacion express esta escuchando: puerto 8010');
})
