const { ContainerFirestore } = require('../../containers/containerFirebase')

class CartDaoFirestore extends ContainerFirestore {
  constructor(){
    super('carts')
  }

  async addProductsToCartById(newElem){
    let elems = await this.getAll();
    if(elems.length <= 0){
        newElem.id=1
    }else{
        newElem.id=parseInt((parseInt(elems[elems.length-1].id))+1);
    };
    let newElemFilt = {name:`${newElem.name}`,products:newElem.products,id:newElem.id};
    return await this.save(newElemFilt,newElemFilt.id)
  }
}

module.exports = { CartDaoFirestore }