import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "./Loader";
//import "../stylesheets/layout.css";

function Layout(props) {
    return (
        <div>
            {props.loading && (<Loader/>)}
            <Header/>
            <div className="content">
                {props.children}
            </div>
           {/* <Footer/> */}
        </div>
    )
}

export default Layout;