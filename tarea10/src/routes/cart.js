const express = require('express')
const { Router } = express
const cartsRouter = Router()

// const { CartDaoFile } = require('../daos/carritos/cartFs.js')
// const cartDao = new CartDaoFile()

// const { CartDaoMongo } = require('../daos/carritos/cartMongo')
// const cartDao = new CartDaoMongo()

const { CartDaoFirestore } = require('../daos/carritos/cartFirebase')
const cartDao = new CartDaoFirestore()

cartsRouter.get('/', async (req, res) => {
  let carts = await cartDao.getAll();
  res.json({carts: carts})
})

cartsRouter.get('/:id', async (req, res) => {
  let carts = await cartDao.getById(req.params.id);
  res.json(carts)
})

cartsRouter.post('/', async (req, res) => {
  let newCart = {name:req.body.name,products:req.body.products};
  let carts = await cartDao.addProductsToCartById(newCart);
  res.json({carts: carts});
})

cartsRouter.put('/:id', async (req, res) => {
  let updateElem = {name:`${req.body.name}`, id:parseInt(req.params.id), products:req.body.products};
  let carts = await cartDao.updateById((req.params.id),updateElem);
  res.json(carts)
})

cartsRouter.delete('/:id', async (req, res) => {
  let deletedCart = await cartDao.deleteById(parseInt(req.params.id))
  res.json(deletedCart)
})


module.exports = cartsRouter