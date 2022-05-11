//Chat---------------------------------------------------------------------------

//Funcion GET Chat
const getChat = (knex) => {
    return knex('chat').select('name', 'time', 'message')
    .then((result) => {
        return result
    }).catch((err) => {
        console.log(err);
    });
}

//Funcion Insert Chat
const insertChat = (knex, name, time, message) => {
    return knex('chat').insert({name: `${name}`, time: `${time}`, message:`${message}`})
    .then((result) => {
        return result
    }).catch((err) => {
        console.log(err);
    });
}



//Products-----------------------------------------------------------------------------------------

//Funcion GET Productos
const getProducts = (knex) => {
    return knex('productos').select('id', 'name', 'price')
    .then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

//Funcion GET por Id
const getProductsId = (knex,id) => {
    return knex('productos').where({id:`${id}`})
    .then((result) => {
        let results = [];
        let resultArray = Object.values(JSON.parse(JSON.stringify(result)));
        resultArray.forEach(v => results.push(v));
        return results;
    }).catch((err) => {
        console.log(err);
    });
}

//Funcion ADD
const insertProducts = (knex, name, price, id) => {
    return knex('productos').insert({name: `${name}`, price: price, id:id})
    .then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

//Funcion Modify

const updateProducts = (knex,id,name, price) => {
    return knex('productos').where({id:id}).update({name:`${name}`,price:price})
    .then((result) => {
        return result;
    }).catch((err) => {
        console.log(err);
    });
}

//Funcion Delete
const deleteProducts = (knex,id) => {
    return knex('productos').where({id:id}).del()
    .then((result) => {
        console.log(result);
        return result;
    }).catch((err) => {
        console.log(err);
    });
}







module.exports={getChat,getProducts,getProductsId,insertChat, insertProducts, updateProducts, deleteProducts}