const express = require('express')
const { Router } = express
const productsRouter = Router()

const { ProductDaoFile } = require('../daos/productos/productsFs.js')
const productDao = new ProductDaoFile()

productsRouter.get('/', async (req, res) => {
  let products = await productDao.getAll();
  res.json({products: products})
})

productsRouter.get('/:id', async (req, res) => {
  let products = await productDao.getById(req.params.id);
  res.json({products: products})
})

productsRouter.post('/', async (req, res) => {
  let newProduct = {name:`${req.body.name}`,price:req.body.price};
  let products = await productDao.addProduct(newProduct);
  res.json({products: products});
})

productsRouter.put('/:id', async (req, res) => {
  let updateElem = {name:`${req.body.name}`, price:req.body.price, id:parseInt(req.params.id)};
  let products = await productDao.updateById((req.params.id),updateElem);
  res.json({products: products})
})

productsRouter.delete('/:id', async (req, res) => {
  let deletedProduct = await productDao.deleteById(parseInt(req.params.id))
  res.json(deletedProduct)
})


module.exports = productsRouter