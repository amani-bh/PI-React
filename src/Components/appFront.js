import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Main from './Pages/order tracker/main'
import Home from './Pages/Home';
import Header from './Static/Header';
import {Outlet } from 'react-router-dom';
import Footer from './Static/Footer';
import AboutsUs from './Pages/AboutsUs';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import ShoppingCart from './Pages/ShoppingCart ';
import AddProduct from './Pages/AddProduct';
import Auction from "./Pages/Auction";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes >
          <Route exact path="/" element={<Layout />} >
            <Route path="home" element={<Home />} />
            <Route path="/abouts" element={<AboutsUs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product" element={<Product />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/add-product" element={<AddProduct />} />
          <Route path="/monitoring-delivery" element ={<Main/>}/>
          <Route path="/auction" element ={<Auction/>}/>

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}
function Layout() {
  return (
    <>
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
