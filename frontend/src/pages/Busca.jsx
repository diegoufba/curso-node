import {useState } from 'react'
import { Card, CardActions, CardContent, CardMedia, Typography, IconButton, Box, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios'
import '../App.css'

export default function Busca() {
  const [data, setData] = useState([])
  const imgPlaceholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAPFBMVEX///+rq6unp6fMzMykpKTp6enx8fHU1NS0tLS6urr6+vqwsLDHx8fPz8/w8PD19fXa2trh4eHl5eXAwMAzrysnAAADpklEQVR4nO2c2ZKDIBAAE6KJmsPr//91c69yKKREHav7dctl6YVhGJTdDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZqE5LMU1XbrvVupELUe9dO9t5PsFyZfuvY1FjWRL994GRnQeRs5NOj+rNpIVCzSMER2M6GBEByM6GNHBiI4cI+mhbdtLE12SFCO3XKnH36ryJnLDQoxU/xm2usZtWIaRWu1nUyLCSNnfh6moE0eEkYvqK4lavpBgpNA368ktYsMSjKSJbqSK2LAEI7VuRB0iNizBSGUYuURsWIIRc4zEXH8lGDkacSTm6YEEI7tMX2zKiA2LMFL185HAMJJWdcj2UIQRfZCEDJEyT5JkH7BcyzBSnrujJORY9r0BSPzXaxlGHv/pz5TJQoQUn4Mw5T1KhBi5x5LseUadnYJKRlcVPLLEGNkVt7qq0rASWtOZa7nno3KM/EB5/mGF2rSRvLdqe+Z1WzZy0Moq6ujz1IaNNJoQz1CyXSO9IPIeJD5ZyXaN6KXIJx6hZLNGKpuQ/Xl8A7BVI6nNx+MAbPTJjRopjAKCdyjZqJHWOmeeSsay+W0asQcRv1CySSM3t4/7IGmHH96ikW8JwKHkNPj0Fo3o2bvBYCiRayRt84u1a/WYkOHfK9bISam92lvW0qOZvRvzZqgwINXI+5zP0rd8dIgMHxwLNdI4+zYaRF643y6QaaT4nxlaxtXo538O3LJlGmk7fetlXKW9/ybuUCLSSC8l7WZchTt7N5S4QolEI1pK2sm4Tt5C7mPLEUoEGjH3tZ++OUoAjkHiKAwINGIWx86vHxTjmUhPib0wIM+IZV/7DpOhn/bZjyvEGbHOjGffQoLIG1thQJoRV3HsFhZEXqjWolyaEUdKqvLyl89hbYUBYUbcKWlYVP1i7p5lGfFOSb05G9JlGfHZ14ZhZiWijFwnF2IJJZKM1NP7eKCFEkFGLEfbk5D1sxJBRvz3tWFohQE5Rk6etaAflPQKA2KMpJFGyJNuYUCKkdJ1tD0JXfVSjFjfj5mMbigRYmToaHsSJf+FARlGftjXhvJ9j1GEEef7MdOhvu8xijASN4i8lXy+dJNgxPhOLw7vL80FGDnO4uN7FCbAyGx3xb0KA+s3cpntysnkGUpWb6Q8zcjjP7B6I7ODEZ1VGznfjrNzW7WRfbIA6zayFBjRWeWtxhU3X+vUi92Ofoh9CR0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA2+AN7/TZH3Ls1kQAAAABJRU5ErkJggg=="

  const [nome, setNome] = useState('')

  const handleChange = (e) => {
    setNome(e.target.value)
  }

  const handleDelete = (id)=>{
    axios.delete(`http://localhost:3000/delete/${id}`)
    .then(response =>{
      console.log(response)
      setData(prevData => prevData.filter(item => item.id !== id))
    })
    .catch(error => console.log(error))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.get(`http://localhost:3000/usuario/${nome}`)
      .then(response => setData(response.data))
      .catch(error => console.log(error))
  }

  return (
    <Box sx={{ minWidth: '16rem', margin:'auto' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ width: '100%' }} id="outlined-basic" label="Pesquise o nome de usuário" variant="outlined"
          slotProps={{
            input: {
              endAdornment: <IconButton onClick={handleSubmit}><SearchIcon /></IconButton>,
            },
          }}
          onChange={handleChange}
        />
      </form>
      <Box sx={{ display: 'flex',flexWrap:'wrap' }}>
        {
          data.map((item, index) => (
            <Card sx={{ maxWidth: 345, p: 1, m: 1 }} key={index}>
              <CardMedia
                component='img'
                height='140'
                image={item.imagem ? item.imagem : imgPlaceholder}
              />

              <CardContent>
                <Typography variant='body2'>
                  {item.conteudo}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={()=>handleDelete(item.id)}><DeleteIcon color='error' /></IconButton>
              </CardActions>
            </Card>
          ))
        }
      </Box>
    </Box>
  )
}