import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';


import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { MainPage } from './pages/Main';

import { OverviewPage } from "./pages/Overview";
import { ShipmentPage } from "./pages/Shipment";

const createError = require('http-errors')

function App() {
  return (
    
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginPage/>} />
          <Route path="register" element={<RegisterPage/>} />
          <Route path="main" element={<MainPage/>}>
            <Route index element={<OverviewPage/>}/>
            <Route path="overview" element={<OverviewPage/>}/>
            <Route path="shipment" element={<ShipmentPage/>}/>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
    
    
  );
}

export default App;
