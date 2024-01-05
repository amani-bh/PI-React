import React from 'react';
import Header from '../Static/Header';
import Footer from '../Static/Footer';
import {Link, Outlet} from 'react-router-dom';


function LayoutDefault(){
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
    <Outlet />
    </main>
    <Footer />
  </>
}

export default LayoutDefault;  