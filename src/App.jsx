import React, { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import "./App.scss"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return(
		<Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
      <ToastContainer />
    </Router>
	);
}

export default App
