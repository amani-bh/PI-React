import "./App.css";
import Checkout from './Components/Pages/checkout'
import Caller from './Components/Pages/chatbot/chatbotCaller'
import Header from "./Components/Static/Header";
import Chatbot from './Components/Pages/chatbot/chatbotMain'
import H from './ComponentsDeliveryOffice/DeliverySpace/mapPage/main'
import Wheel from "./ComponentsDeliveryOffice/DeliverySpace/wheelOfFortune/wheel";
import DeliveryHeader from "./ComponentsDeliveryOffice/DeliverySpace/static/header";
import DeliveryFooter from "./ComponentsDeliveryOffice/DeliverySpace/static/footer";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import Footer from "./Components/Static/Footer";
import SocketProvider from "./Utils/socketProvider";
import Maps from "./ComponentsDeliveryOffice/DeliverySpace/mapPage/main";
import Mains from "./ComponentsDeliveryOffice/DeliverySpace/workingPage/mains";
import Home from "./Components/Pages/Home";
import AboutsUs from "./Components/Pages/AboutsUs";
import Shop from "./Components/Pages/Shop";
import Product from "./Components/Pages/Product";
import ShoppingCart from "./Components/Pages/ShoppingCart ";
import AddProduct from "./Components/Pages/AddProduct";
import Main from "./Components/Pages/order tracker/main";
import UserProduct from "./Components/Pages/UserProduct";
import SignIn from "./Components/Pages/UserComponents/Login";
import Profile from "./Components/Pages/UserComponents/Profile";
import HeaderAuth from "./Components/Pages/AuthStatic/HeaderAuth";
import AuthService from "./Components/Pages/AuthServices/auth.service";
import { useEffect, useState } from "react";
import EventBus from "./Components/Pages/AuthCommons/EventBus";
import AccessDenied from "./Components/Pages/UserComponents/AccessDenied";
import UpdateProfile from "./Components/Pages/UserComponents/UpdateProfile";
import SignUp from "./Components/Pages/UserComponents/SignUp";
import Welcome from "./Components/Pages/UserComponents/Welcome";
import ProductsToExchange from "./Components/Pages/ProductsToExchange";
import Messenger from "./Components/Pages/Messenger/messenger/messenger";
import SpeechToText from "./Components/Pages/Messenger/messenger/speechToText";


import UpdateProduct from "./Components/Pages/UpdateProduct";
import UserExchanges from "./Components/Pages/UserExchanges";

import Auction from "./Components/Pages/Auction";
import AuctionDetails from "./Components/Pages/AuctionDetails";
import UserWishlist from "./Components/Pages/UserWishlist";

import ForgotPassword from "./Components/Pages/UserComponents/ForgotPassword";
import ResetPassword from "./Components/Pages/UserComponents/ResetPassword";

import UserTransactions from "./Components/Pages/UserTransactions";



function App(props) {

    useEffect(() => {

        EventBus.on("logout", () => {
            logOut();
        });

        EventBus.on("ad", () => {

            setTimeout(() => {
                window.open('http://localhost:3002', "_self");
            }, 0);
        });

        return () => {
            EventBus.remove("logout");
            EventBus.remove("ad");
        };
    }, []);

    const logOut = () => {
        AuthService.logout();
        window.location.reload(false);

    };

    return (
        <>
            {/* <SocketProvider>
      <AppFront/>
      </SocketProvider>

      <SocketProvider>
      <AppDeliveryOffice/>
      </SocketProvider> */}

            <BrowserRouter>
                <Routes>

                    {/* Auth Space */}
                    <Route path="/auth"  >
                        <Route path="signin" element={<SignIn />} />
                        <Route path="signup" element={<SignUp />} />
                        <Route path="confirm/:verify_token" element={<Welcome />} />
                        <Route path="forgot" element={<ForgotPassword />} />
                        <Route path="reset/:reset_token" element={<ResetPassword />} />
                    </Route>

                    {/* Delivery Space */}
                    <Route path="/delivery" element={<CheckAuthDeliveryRoute />}>
                        <Route path="home" element={<Maps />} />
                        <Route path="tasks" element={<Mains />} />
                        <Route path="wheel" element={<Wheel />} />

                    </Route>
                    {/* Client Space */}

                    <Route exact path="/" element={<CheckAuthRoute />} >
                        <Route path="home" element={<Home />} />
                        <Route path="/abouts" element={<AboutsUs />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<Product />} />
                        <Route path="/cart" element={<ShoppingCart />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/monitoring-delivery" element={<Main />} />
                        <Route path="/test" element={<Chatbot />} />
                        <Route path="/user-product" element={<UserProduct />} />
                        <Route path="/productsToExchange/:id" element={<ProductsToExchange />} />
                        <Route path="userExchanges" element={<UserExchanges />} />
                        <Route path="userTransactions" element={<UserTransactions />} />

                        <Route path="/wishlist" element={<UserWishlist />} />
                        <Route path="messenger" element={<Messenger />} />
                        <Route path="speech" element={<SpeechToText />} />

                        <Route path="/update-product/:id" element={<UpdateProduct />} />

                        <Route path="/monitoring-delivery" element={<Main />} />
                        <Route path="/auction" element={<Auction />} />
                        <Route path="/auction/:id" element={<AuctionDetails />} />

                        <Route path="/profile" element={<Profile />} />
                        <Route path="/accessdenied" element={<AccessDenied />} />
                        <Route path="/updateprofile" element={<UpdateProfile />} />

                        <Route path="/test" element={<Chatbot />} />
                    </Route>
                </Routes>
            </BrowserRouter>

        </>
    );

}

function Layout() {
    return (
        <>
            <DeliveryHeader />
            <Outlet />

            <DeliveryFooter />
        </>
    );
}



function Outleter() {
    return (
        <>
            <Header />
            <Outlet />
            <Caller />
            <Footer />
        </>
    );
}

function OutleterAuth() {
    return (
        <>
            {/* <HeaderAuth /> */}
            <Outlet />
            <SignIn/>
            {/* <Caller /> */}
            {/* <Footer /> */}
        </>
    );
}

const CheckAuthRoute = () => {
    const user = AuthService.getCurrentUser();

    return user ? <Outleter /> : <Navigate to="/auth/signin" />;
}

const CheckAuthDeliveryRoute = () => {
    const user = AuthService.getCurrentUser();

    return user ? (user.role[0] === "ROLE_DELIVERY_MAN" ? <Layout /> : <Navigate to="/accessdenied" />) : <Navigate to="/auth" />;
}


export default App;
