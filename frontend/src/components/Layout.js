import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const sideMenuStyle = {
        height: '100%',
        width: isOpen ? '250px' : '0',
        position: 'fixed',
        zIndex: 1,
        top: 0,
        left: 0,
        backgroundColor: '#343a40',
        overflowX: 'hidden',
        transition: '0.5s',
        paddingTop: '60px',
        pointerEvents: 'none'  // This makes the entire menu ignore mouse events
    };

    const menuContentStyle = {
        pointerEvents: 'auto'  // This restores mouse events for menu content
    };

    const menuItemStyle = {
        padding: '8px 8px 8px 32px',
        color: '#818181',
        textDecoration: 'none',
        display: 'block',
        transition: '0.3s',
        cursor: 'pointer'
    };

    return (
        <div>
            <div style={sideMenuStyle}>
                <div style={menuContentStyle}>
                    <span 
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '25px',
                            fontSize: '36px',
                            color: '#818181',
                            cursor: 'pointer'
                        }} 
                        onClick={toggleMenu}
                    >
                        &times;
                    </span>
                    <NavLink 
                        to="/" 
                        style={menuItemStyle} 
                        onClick={toggleMenu}
                    >
                        Home
                    </NavLink>
                    {/* <NavLink 
                        to="/write" 
                        style={menuItemStyle}
                        onClick={toggleMenu}
                    >
                        Write Story
                    </NavLink> */}
                    <NavLink 
                        to="/stories" 
                        style={menuItemStyle}
                        onClick={toggleMenu}
                    >
                        My Stories
                    </NavLink>
                    <NavLink 
                        to="/settings" 
                        style={menuItemStyle}
                        onClick={toggleMenu}
                    >
                        Settings
                    </NavLink>
                </div>
            </div>
            <nav className="navbar navbar-dark bg-dark">
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    onClick={toggleMenu}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <span className="navbar-brand mb-0 h1" style={{ marginLeft: '-15px' }}>Story Generater</span>
            </nav>
            <main>
                {children}
            </main>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired
};

export default Layout;
