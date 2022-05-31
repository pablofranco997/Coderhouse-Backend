const fs = require('fs');

class ContainerFile {

  constructor(fileName) {
      this.fileName = fileName;
  }

  saveInFile(content) {
      fs.writeFileSync(this.fileName, JSON.stringify(content, null,'\t'));
  }

  getContentFile() {
      let content = [];

      try {
          let file = fs.readFileSync(this.fileName, 'utf-8');
          content = JSON.parse(file);
      } catch (error) {
          this.saveInFile(content);
          console.log(`Creacion del archivo ${this.fileName}`);
      }

      return content;
  }

  getById(id){
    let contentArray = this.getContentFile();
    let found = contentArray.find(x => x.id == id);

    if(contentArray.length > 0){
      if(found != undefined){
        //Si found tiene un resultado, lo muestra
        return(found);
      }else{
          //Si no, muestra el error
          return({error:"no encontrado"});
      }
    }else{
      return({error:"no encontrado"});
    }
  }

  deleteById(id){
    let contentArray = this.getContentFile()
    if(contentArray.length > 0){
    let newElementArray = contentArray.filter(elem => elem.id != id)
    this.saveInFile(newElementArray)
    }
    return { status: 'Removed' }
  }

  updateById(id, content){
    let contentArray = this.getContentFile()
    let index = contentArray.findIndex(elem => elem.id == id)
    contentArray[index] = content
    this.saveInFile(contentArray)
    return contentArray
  }
}

module.exports = { ContainerFile }