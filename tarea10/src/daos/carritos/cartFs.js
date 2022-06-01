const { ContainerFile } = require('../../containers/containerFs.js')

class CartDaoFile extends ContainerFile {
    constructor() {
        super('./utilities/db/carts.json');
        let carts = this.getAll();
        this.id = (carts.length > 0) ? carts[carts.length -1].id + 1 : 1;
    }


    getAll() {
        let carts = this.getContentFile();
        return carts;
    }

    addProductsToCartById(newElem){
        let elems = this.getContentFile();
        if(elems.length <= 0){
            newElem.id=1
        }else{
            newElem.id=parseInt((parseInt(elems[elems.length-1].id))+1);
        }
        let newElemFilt = {id:newElem.id,name:newElem.name,products:newElem.products}
        elems.push(newElemFilt);
        this.saveInFile(elems)
        return elems
    }

}

module.exports = { CartDaoFile }