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
import { OverviewPage } from './pages/Overview';

const createError = require('http-errors')

function App() {
  return (
    <BrowserRouter>
      <div className="App">

          <NavBar bg = "dark" variant="dark">
            <Container>

              <NavBar.Brand>
                <Link to={"/"} className="nav-link">
                  Project Yoru
                </Link>
              </NavBar.Brand>

              <Nav className="justify-content-end">
                <Nav>
                  <Link to={"/map"} class="nav-link">
                    Map
                  </Link>
                </Nav>
                <Nav>
                  <Link to={"/create-company"} class="nav-link">
                    Create company
                  </Link>
                </Nav>
                <Nav>
                  <Link to={"/company-list"} class="nav-link">
                    Company List
                  </Link>
                </Nav>
                <Nav>
                  <Link to={"/overview"} class="nav-link">
                    Overview
                  </Link>
                </Nav>
              </Nav>

            </Container>
          </NavBar>
          
        <Container>
          <Row>
            <Col md="12">
              <div className="wrapper">
                <Routes>
                  <Route exact path="/" element={<Login/>}/>
                  <Route path="/create-company" element={<CreateCompany/>}/>
                  <Route path="/edit-company/:id" element={<EditCompany/>}/>
                  <Route path="/company-list" element={<CompanyList/>}/>
                  <Route path="/add-staff/:id" element={<AddStaff/>}/>
                  <Route path="/add-dist-center/:id" element={<AddDistCenter/>}/>
                  <Route path="/map/" element={<MapPage/>}/>
                  <Route path="/overview" element={<OverviewPage/>}/>
                </Routes>
              </div>
            </Col>
          </Row>
        </Container>

      </div>
    </BrowserRouter>
  );
}

export default App;
