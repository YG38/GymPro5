import React from 'react';
const footerStyles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px 0',
        textAlign: 'center',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    footerLinks: {
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    footerLink: {
        color: '#fff',
        textDecoration: 'none',
    },
};

const Footer = () => {
    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.container}>
                <p>&copy; {new Date().getFullYear()} GymPro. All rights reserved.</p>
                <ul style={footerStyles.footerLinks}>
                    <li><a href="/about" style={footerStyles.footerLink}>About Us</a></li>
                    <li><a href="/contact" style={footerStyles.footerLink}>Contact</a></li>
                    <li><a href="/privacy" style={footerStyles.footerLink}>Privacy Policy</a></li>
                </ul>
            </div>
        </footer>
    );
};

// Removed duplicate Footer component

export default Footer;