const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const cookieParser = require("cookie-parser")
require("dotenv").config()
const cors = require('cors')
const jwt = require("jsonwebtoken")

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


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.get('/usuario/:nome', (req, res) => {
    try {
        const nome = req.params.nome

        const query1 = 'SELECT id FROM usuario WHERE nome=?'

        connection.query(query1, [nome], (err, result) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Erro ao consultar o banco de dados' })
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' })
            }
            const id = result[0].id

            const query2 = 'SELECT * FROM postagem WHERE uid=?'

            connection.query(query2, [id], (err, result) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ error: 'Erro ao consultar postagens' })
                }
                if (result.length === 0) {
                    return res.status(404).json({ error: 'O usuário não possui postagens' })
                }
                res.status(200).json(result)
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Erro inesperado no servidor' })
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
            return res.status(409).json({ error: 'Usuário já existe no banco de dados' })
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


app.get('/decodeId', (req, res) => {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' })
        }

        const nome = decoded.nome
        const id = decoded.id

        res.status(200).json({id,nome})
    });
});

app.post('/login', (req, res) => {

    const { nome, senha } = req.body

    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios' })
    }

    const query = 'SELECT id,senha FROM usuario WHERE nome=?'

    connection.query(query, [nome], (err0, result0) => {
        if (err0) {
            console.error(err0)
            return res.status(500).json({ error: err0 })
        }
        if (result0.length === 0) {
            return res.status(409).json({ error: 'Usuário não existe no banco de dados' })
        }
        bcrypt.compare(senha, result0[0].senha, (err, result) => {

            if (err) {
                console.error('Erro ao usar desencriptar senha: ', err)
                return res.status(500).json({ error: 'Erro ao usar desencriptar senha' })
            }

            if (result) {
                const token = jwt.sign({ id: result0[0].id, nome: nome }, process.env.JWT_SECRET, { expiresIn: '1h' })
                res.cookie("token", token)
                res.status(200).json({ message: 'Login bem sucedido' })
            } else {
                return res.status(401).json({ error: 'Senha incorreta' })
            }
        })
    })
})

app.post('/post', (req, res) => {
    const { conteudo, imagem } = req.body;
    const token = req.cookies.token;
    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const uid = decoded.id;

        if (imagem.length > 255) {
            return res.status(500).json({ error: 'A URL da imagem deve ter menos de 255 caracteres' });
        }

        const query = 'INSERT INTO postagem (uid, conteudo, imagem) VALUES (?, ?, ?)';
        connection.query(query, [uid, conteudo, imagem], (err, result) => {
            if (err) {
                console.error('Erro ao inserir postagem: ', err);
                return res.status(500).json({ error: 'Erro ao inserir postagem' });
            }
            res.status(201).json({ message: 'Postagem inserida com sucesso' });
        });
    });
});


app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const uid = decoded.id;
        const query = 'DELETE FROM postagem WHERE id=? AND uid=?';

        connection.query(query, [id, uid], (err, result) => {
            if (err) {
                console.error('Erro ao deletar postagem: ', err);
                return res.status(500).json({ error: 'Erro ao deletar postagem' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Postagem não encontrada ou acesso negado' });
            }

            res.status(200).json({ message: 'Postagem deletada com sucesso' });
        });
    });
});


app.listen(3000, () => {
    console.log('Rodando em http://localhost:3000')
})