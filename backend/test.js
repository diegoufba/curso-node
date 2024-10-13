
const express = require("express")
const cookieParser = require("cookie-parser") require("dotenv").config()
const db = require("./db.json")
const jwt = require("jsonwebtoken")
const app = express()
app.use(cookieParser())
app.use(express.json()) app.use(express.urlencoded({ extendable: true }))
function authenticate(req, res, next) {
    const cookie = req.cookies;
    if (!cookie) return res.status(403).send({ message: "Alguma coisa deu errado." }); try {
        jwt.verify(cookie.acess_t, process.env.ACESS_TOKEN_KEY);
        next();
    } catch (e) {
        jwt.verify(cookie.refresh_t, process.env.REFRESH_TOKEN_KEY, (err, user) => {
            if (err) return res.status(401).send(err);
            const token = jwt.sign({ username: user.username }, process.env.ACESS_TOKEN_KEY, { expiresIn: 10 }); res.cookie("acess_t", token);
            next();
        });
    }
}
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})
app.post("/login", (req, res) => {
    const user = req.body;
    console.log(user)
    console.log(db)
    const result = db.find((u) => u.username === user.username); if (!result) {
        return res.status(404).send({ message: "Usuário não encontrado" });
    }
    if (result.password !== user.password) {
        return res.status(404).send({ message: "Senha incorreta" });
    }
    const cookie = {
        acess_t: jwt.sign({ username: user.username }, process.env.ACESS_TOKEN_KEY, { expiresIn: 10 }),
        refresh_t: jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_KEY, { expiresIn: 180 }),
    };
    res.clearCookie(); res.cookie("acess_t", cookie.acess_t);
    res.cookie("refresh_t", cookie.refresh_t);
    return res.status(200).send({ message: "Usuário Logado com sucesso", token: cookie.acess_t });
});
app.use(authenticate)
app.get("/cookie", (req, res) => {
    res.status(200).send(req.cookies)
})
app.listen(3000, () => {
    console.log("Server rodando na porta 3000")
})