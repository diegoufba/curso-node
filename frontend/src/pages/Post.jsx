import { useState } from 'react'
import { Typography, Box, TextField, Button } from '@mui/material';
import axios from 'axios'
import '../App.css'




export default function Post() {
    //https://unsplash.it/300/200?random

    const [conteudo, setConteudo] = useState('')
    const [imagem, setImagem] = useState('')

    const handleChangeConteudo = (e) => {
        setConteudo(e.target.value)
    }

    const handleChangeImagem = (e) => {
        setImagem(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/post', {
            conteudo: conteudo,
            imagem: imagem
        },{ withCredentials: true })
            .then(response => {
                console.log(response)
                alert(response.data.message)
            })
            .catch(error => {
                console.log(error)
                alert(error.response.data.error)
            })
    }

    return (
        <Box>
            <Typography variant="h2" gutterBottom>Post</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    sx={{ width: '100%', m: 1 }} id="outlined-basic1" label="Conteudo" variant="outlined"
                    multiline
                    onChange={handleChangeConteudo}
                />
                <TextField
                    sx={{ width: '100%', m: 1 }} id="outlined-basic2" label="Link da Imagem" variant="outlined"
                    onChange={handleChangeImagem}
                />
                <Button onClick={handleSubmit} variant="contained">Postar</Button>
            </form>
        </Box>
    )
}