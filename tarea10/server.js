const express = require('express');
const app = express();
const productsRouter = require('./src/routes/products.js');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/productos', productsRouter);

app.listen(8080, () => {
    console.log('Server on port 8080');
});
