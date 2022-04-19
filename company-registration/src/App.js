import Nav from 'react-bootstrap/Nav';
import NavBar from 'react-bootstrap/NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.css'

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Login from "./components/loginScreen"
import CreateCompany from "./components/create-company.component"
import EditCompany from "./components/edit-company.component"
import CompanyList from "./components/company-list.component"
import AddStaff from "./components/add-account.component"
import MapPage from "./components/map/map.component"
import AddDistCenter from "./components/add-dist-center.component"
import ViewStaff from "./components/view-staff.component"
import { OverviewPage } from './pages/Overview';
import ViewShipment from "./components/view-shipment.component"

import { CustomSidebar } from './components/sidebar';

const createError = require('http-errors')

function App() {
  return (
    
    <BrowserRouter>
      <div className="App">
        <CustomSidebar/>
      </div>
    </BrowserRouter>
    
    
  );
}

export default App;
