const {ContainerMongo} = require('../../containers/containerMongo');
const products = require('../../models/productModel');
const productModel = require('../../models/productModel')

class ProductDaoMongo extends ContainerMongo{
  constructor() {
    super(productModel);
  }

  async addProduct(newProduct){
    let x = new products(newProduct);
    let elems = await this.getAll();
    if(elems.length <= 0){
        x.id=1
    }else{
        x.id=parseInt((parseInt(elems[elems.length-1].id))+1);
    }
    await x.save()
    return this.getAll()
  }
} 

module.exports = { ProductDaoMongo }