import React from 'react'
import './App.css'

import Navbar from './Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login';
import axios from 'axios';
import Signin from './Sign_in';

function App() {


  axios.get('http://localhost:3001/api/v1/auth/42/callback', {
    headers : {
      Authorization : `Bearer ${localStorage.getItem('token')}`
    }
  }).then((res) => {

});
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /></>}>
      </Route>
      <Route path="/Login" element={<><Login /></>}></Route>
      <Route path="/auth/42/callback" element={<><div> yesy qwhdqdw </div></>}></Route>
      <Route path='/Sign_in' element={<><Signin/></>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
