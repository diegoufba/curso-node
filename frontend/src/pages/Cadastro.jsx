import { useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Typography, IconButton, Box, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'
import '../App.css'

export default function Cadastro() {
    const [nome, setNome] = useState('')
    const [senha, setSenha] = useState('')

    const handleChangeNome = (e) => {
        setNome(e.target.value)
    }

    const handleChangeSenha = (e) => {
        setSenha(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/login', {
            nome: nome,
            senha: senha
        })
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }

    return (
        <Box>
            <Typography variant="h2" gutterBottom>Cadastro</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    sx={{ width: '100%', m: 1 }} id="outlined-basic1" label="Nome" variant="outlined"
                    multiline
                    onChange={handleChangeNome}
                />
                <TextField
                    sx={{ width: '100%', m: 1 }} id="outlined-basic2" label="Senha" variant="outlined"
                    type="password"
                    onChange={handleChangeSenha}
                />
                <Button onClick={handleSubmit} variant="contained">Cadastro</Button>
            </form>
        </Box>
    )
}