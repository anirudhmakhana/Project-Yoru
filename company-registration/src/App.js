import Nav from 'react-bootstrap/Nav';
import NavBar from 'react-bootstrap/NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import { BrowserRouter } from 'react-router-dom';

import { CustomSidebar } from './components/sidebar';

import { LoginPage } from './pages/Login';

const createError = require('http-errors')

function App() {
  return (
    
    <BrowserRouter>
      <div className="App">
        <LoginPage/>
        {/* <CustomSidebar/> */}
      </div>
    </BrowserRouter>
    
    
  );
}

export default App;
