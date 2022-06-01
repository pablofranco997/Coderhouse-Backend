const {ContainerMongo} = require('../../containers/containerMongo');
const carts = require('../../models/cartModel');
const cartModel = require('../../models/cartModel')

class CartDaoMongo extends ContainerMongo{
  constructor() {
    super(cartModel);
  }

  async addProductsToCartById(newCart){
    let x = new carts(newCart);
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

module.exports = { CartDaoMongo }