
import './App.css';
import Homepage from './pages/Homepage';
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import ProductInfo from './pages/ProductInfo';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';

import "./stylesheets/layout.css";
import "./stylesheets/products.css";
import "./stylesheets/authentication.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
 

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
      <Routes>

        <Route path="/" exact element={<ProtectedRoutes><Homepage/></ProtectedRoutes>} />
        <Route path="/login" exact element={<LoginPage/>} />
        <Route path="/register" exact element={<RegisterPage/>} />
        <Route path="/productInfo/:productid" exact element={<ProtectedRoutes><ProductInfo/></ProtectedRoutes>} />
        <Route path="/cart" exact element={<ProtectedRoutes><CartPage/></ProtectedRoutes>} />
        <Route path="/orders" exact element={<ProtectedRoutes><OrdersPage/></ProtectedRoutes>} />
        <Route path="/admin" exact element={<ProtectedRoutes><AdminPage/></ProtectedRoutes>} />

      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

export const ProtectedRoutes=({children})=>{
  if(localStorage.getItem('currentUser')){
    return children
  } else{
    return <Navigate to="/login"/>
  }
}