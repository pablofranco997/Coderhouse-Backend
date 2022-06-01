const mongoose = require('mongoose');
const MONGO_URL = 'mongodb+srv://admin:admin@coderhouse.lj9yk.mongodb.net/?retryWrites=true&w=majority';
class ContainerMongo {
    constructor(model) {
        mongoose.connect(MONGO_URL, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
        }, () => console.log('Connected'))

        this.model = model;
    }

    async getAll(){
        return await this.model.find()
    }

    async getById(id){
        return await this.model.find({id:id})
    }

    async deleteById(id){
        return await this.model.deleteOne({id:id});
    }

    async updateById(id, update){
        return await this.model.updateOne({id:id}, update)
    }
}

module.exports = {ContainerMongo};