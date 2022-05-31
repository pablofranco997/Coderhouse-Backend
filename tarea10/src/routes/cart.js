const express = require('express')
const { Router } = express
const cartsRouter = Router()

const { CartDaoFile } = require('../daos/carritos/cartFs.js')
const cartDao = new CartDaoFile()

cartsRouter.get('/', async (req, res) => {
  let carts = await productDao.getAll();
  res.json({carts: carts})
})

cartsRouter.get('/:id', async (req, res) => {
  let carts = await cartDao.getById(req.params.id);
  res.json({carts: carts})
})

cartsRouter.post('/', async (req, res) => {
  let newCart = {id:req.body.id,name:req.body.id,products:{products:req.body.products.product,quantity:req.body.products.quantity}};
  let products = await productDao.addProductsToCartById(newCart);
  res.json({products: products});
})

cartsRouter.put('/:id', async (req, res) => {
  let updateElem = {name:`${req.body.name}`, price:req.body.price, id:parseInt(req.params.id)};
  let products = await productDao.updateById((req.params.id),updateElem);
  res.json({products: products})
})

cartsRouter.delete('/:id', async (req, res) => {
  let deletedProduct = await productDao.deleteById(parseInt(req.params.id))
  res.json(deletedProduct)
})


module.exports = productsRouter