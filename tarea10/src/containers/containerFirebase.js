let admin = require('firebase-admin')
const FIRESTORE_PATH_FILE = require('./../../utilities/firebase/backendcoder-eee3f-firebase-adminsdk-bfk5v-8b16d5fd19.json')

admin.initializeApp({
  credential: admin.credential.cert(FIRESTORE_PATH_FILE)
})

const db = admin.firestore()

class ContainerFirestore {
  constructor(collection){
    this.collection = db.collection(collection)
    console.log(`Base conectada con la collection ${collection}`)
  }

  async save(document, id){
    let doc = this.collection.doc(`${id}`)
    let item = await doc.create(document)
    return item
  }

  async getAll(){
    let result = await this.collection.get()
    result = result.docs.map(doc => ({ 
      id: doc.id,
      data: doc.data()
    }))
    return result
  }

  async getById(id){
    let result = await this.collection.get()
    result = result.docs.map(doc => ({ 
      id: doc.id,
      data: doc.data()
    }))
    let item = result.find(elem => elem.id == id)
    return item
  }

  async deleteById(id){
    let doc = this.collection.doc(`${id}`)
    let item = doc.delete()
    return ({ status: 'Deleted' })
  }

  async updateById(id,content){
    let doc = this.collection.doc(`${id}`)
    let item = await doc.update(content)
    return item
  }
}

module.exports = { ContainerFirestore }