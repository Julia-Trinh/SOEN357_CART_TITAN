import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';


function Layout() {

    const navigate = useNavigate();
    return (
        <div className="homePage">
            <header className="header">

                <div className="logo_div" onClick={() => {
                    navigate('/');
                }}>
                    <img src="/logo.png" alt="logo" className="logo_image" />
                </div>

                <div className="tabs">
                    <div className="tab_div" onClick={() => { navigate("/about") }}><img src="/about.png" className="tab_image"></img></div>
                    <div className="tab_div" onClick={() => { navigate("/recipe/metro") }}><img src="/recipe.png" className="tab_image"></img></div>
                    <div className="tab_div" onClick={() => { navigate("/grocery") }}><img src="/grocery.png" className="tab_image"></img></div>
                </div>

            </header>
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
