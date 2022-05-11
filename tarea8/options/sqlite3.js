const knexSqLite = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './DB/chat.sqlite'
    },
    useNullAsDefault: true
})

module.exports = { knexSqLite };