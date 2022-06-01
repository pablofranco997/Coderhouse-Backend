const express = require('express');
const app = express();
const productsRouter = require('./src/routes/products.js');
const cartsRouter = require('./src/routes/cart')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/productos', productsRouter);
app.use('/api/carritos', cartsRouter)

app.listen(8080, () => {
    console.log('Server on port 8080');
});
