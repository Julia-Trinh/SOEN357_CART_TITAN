import React, {useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';


function Layout() {

    const navigate = useNavigate();
     const [showMessage, setShowMessage] = useState(false);

     const handleClick = (e) => {
    e.preventDefault();
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000); // hide after 2 seconds
  };
    return (
        <div className="homePage">
            <header className="header">

                <div className="logo_div" onClick={() => {
                    navigate('/');
                }}>
                    <img src="/logo.png" alt="logo" className="logo_image" />
                </div>

                <div className="tabs">
                    <div className="tab_div" onClick={() => { navigate("/about") }}><p id="recipes" >About</p></div>
                    <div className="tab_div" onClick={() => { navigate("/recipe/metro") }}><p id="recipes" >Recipies</p></div>
                    <div className="tab_div" onClick={() => { navigate("/grocery") }}><p id="recipes" >Grocery List</p></div>
                    <div className="tab_div user-tooltip-container" onClick={(e) => {handleClick(e)}} onMouseEnter={() => setShowMessage(true)} onMouseLeave={() => setShowMessage(false)}>
                        <img src="/profile-user.png" className="user_image"></img>
                        {showMessage && (
                            <div className="user-tooltip">
                                <p>User profile section is currently under construction.</p>
                                <p>Check back soon for login and account features!</p>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <main className="main">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;