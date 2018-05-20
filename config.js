var config = {
    database: {
        host:      'localhost',     // local de armazenamento de BD
        user:       'root',         // nome de usuario do Servidor
									// sem senha então sem password
        port:       3306,         // porta padrão do BD
        db:       'projeto'         // banco de dados 
    },
    server: {
        host: '127.0.0.1',
        port: '3000'
    }
}
 
module.exports = config