const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
require("dotenv").config()

const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USUARIO,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL: ', err)
        // return res.status(500).json({ error: 'Erro ao conectar ao banco de dados MySQL' })
    } else {
        console.log('Conectado ao MySQL')
        // return res.status(200).json({ message: 'Conectado ao banco de dados MySQL com sucesso' })
    }
})

app.use(express.json());

app.get('/usuario/:nome', (req, res) => {
    try {
        const nome = req.params.nome

        const query1 = 'SELECT id FROM usuario WHERE nome=?'

        connection.query(query1, [nome], (err, result) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Erro ao consultar o banco de dados' });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' })
            }
            const id = result[0].id

            const query2 = 'SELECT conteudo,imagem FROM postagem WHERE uid=?'

            connection.query(query2, [id], (err, result) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: 'Erro ao consultar postagens' });
                }
                if (result.length === 0) {
                    return res.status(404).json({ error: 'O usuário não possui postagens' });
                }
                res.status(200).json(result)
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Erro inesperado no servidor' });
    }
})

app.post('/cadastro', (req, res) => {
    const { nome, senha } = req.body

    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' })
    }

    if (senha.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 dígitos' })
    }

    const query1 = 'SELECT nome FROM usuario WHERE nome=?'

    connection.query(query1, [nome], (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ error: err })
        }
        if (result.length !== 0) {
            return res.status(409).json({ error: 'Usuário já existe no banco de dados' });
        }
    })

    bcrypt.hash(senha, 10, (err0, hash) => {

        if (err0) {
            console.error('Erro ao encriptar senha: ', err0)
            return res.status(500).json({ error: 'Erro ao encriptar senha' })
        }

        const query2 = 'INSERT INTO usuario (nome,senha) VALUES (?,?)'

        connection.query(query2, [nome, hash], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário: ', err)
                return res.status(500).json({ error: 'Erro ao inserir usuário' })
            }
            res.status(201).json({ message: 'Usuário inserido com sucesso' })
        })
    })
})

app.post('/login', (req, res) => {

    const { nome, senha } = req.body

    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' })
    }

    const query = 'SELECT senha FROM usuario WHERE nome=?'

    connection.query(query, [nome], (err0, result0) => {
        if (err0) {
            console.error(err0)
            return res.status(500).json({ error: err0 })
        }
        if (result0.length === 0) {
            return res.status(409).json({ error: 'Usuário não existe no banco de dados' });
        }
        bcrypt.compare(senha, result0[0].senha, (err, result) => {

            if (err) {
                console.error('Erro ao usar desencriptar senha: ', err)
                return res.status(500).json({ error: 'Erro ao usar desencriptar senha' })
            }

            if (result) {
                res.status(200).json({ message: 'Login bem sucedido' })
            } else {
                return res.status(401).json({ error: 'Senha incorreta' })
            }
        });
    })
})

app.post('/post', (req, res) => {
    const { conteudo, imagem } = req.body
    const uid = 1 // Pegar id do usuario logado
    const query = 'INSERT INTO postagem (uid,conteudo,imagem) VALUES (?, ?, ?)'

    connection.query(query, [uid, conteudo, imagem], (err, result) => {
        if (err) {
            console.error('Erro ao inserir postagem: ', err)
            return res.status(500).json({ error: 'Erro ao inserir postagem' })
        }
        res.status(201).json({ message: 'Postagem inserida com sucesso' })
    })
})

app.listen(3000, () => {
    console.log('Rodando em http://localhost:3000')
})