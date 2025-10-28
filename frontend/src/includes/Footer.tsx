import React from 'react';
import '../styles/Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-info">
                        <span className="text-muted">© 2025 Linn and Jacob. Group L & J</span>
                    </div>
                    
                    <div className="footer-links">
                        <a href="https://github.com/vinkeln/ssr-editor-frontend" className="footer-link">Github</a>
                        <a href="https://jsramverk.se/development" className="footer-link">Development</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;