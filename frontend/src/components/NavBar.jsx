import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1,mb:4 }}>
      <AppBar position="static" color='white'>
        <Toolbar>
          <Button color="inherit"><Link to="/">Login</Link></Button>
          <Button color="inherit"><Link to="/cadastro">Cadastro</Link></Button>
          <Button color="inherit"><Link to="/post">Post</Link></Button>
          <Button color="inherit"><Link to="/busca">Busca</Link></Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}