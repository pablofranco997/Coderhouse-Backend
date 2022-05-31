const { ContainerFile } = require('../../containers/containerFs.js')

class ProductDaoFile extends ContainerFile {
    constructor() {
        super('./utilities/db/products.json');
        let products = this.getAll();
        this.id = (products.length > 0) ? products[products.length -1].id + 1 : 1;
    }


    getAll() {
        let products = this.getContentFile();

        return products;
    }

    addProduct(newElem){
        let elems = this.getContentFile();
        if(elems.length <= 0){
            newElem.id=1
        }else{
            newElem.id=parseInt((parseInt(elems[elems.length-1].id))+1);
        }
        let newElemFilt = {name:`${newElem.name}`,price:newElem.price,id:newElem.id}
        elems.push(newElemFilt);
        this.saveInFile(elems)
        return elems
    }

}

module.exports = { ProductDaoFile }