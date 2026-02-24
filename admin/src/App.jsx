import React from 'react';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import List from '../pages/List/List';
import Orders from '../pages/Orders/Order';
import Add from '../pages/Adds/Add';
import Analytics from '../pages/Analytics/Analytics';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url =" http://localhost:5173/"
  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/Add" element={<Add url={url}/>} />
          <Route path="/List" element={<List url={url} />} />
          <Route path="/Orders" element={<Orders url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
