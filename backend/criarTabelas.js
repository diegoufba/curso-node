const mysql = require('mysql2');
require("dotenv").config();

// Conectar ao banco de dados MySQL
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err);
        process.exit(1);
    } else {
        console.log('Conectado ao MySQL');
        criarTabelas();
    }
});

function criarTabelas() {
    const criarUsuarioTable = `
        CREATE TABLE IF NOT EXISTS usuario (
            id INT NOT NULL AUTO_INCREMENT,
            nome VARCHAR(255) DEFAULT NULL,
            senha VARCHAR(255) DEFAULT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    const criarPostagemTable = `
        CREATE TABLE IF NOT EXISTS postagem (
            id INT NOT NULL AUTO_INCREMENT,
            uid INT NOT NULL,
            conteudo VARCHAR(255) NOT NULL,
            imagem VARCHAR(255) DEFAULT NULL,
            PRIMARY KEY (id),
            KEY id_idx (uid),
            CONSTRAINT id FOREIGN KEY (uid) REFERENCES usuario(id)
        ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

    connection.query(criarUsuarioTable, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela usuario: ', err);
            return;
        }
        console.log('Tabela "usuario" criada ou já existe.');

        connection.query(criarPostagemTable, (err, result) => {
            if (err) {
                console.error('Erro ao criar tabela postagem: ', err);
                return;
            }
            console.log('Tabela "postagem" criada ou já existe.');
            inserirDados();
        });
    });
}