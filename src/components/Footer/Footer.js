import React from 'react';
import './Footer.css'
import CONF from "../../tools/conf"

function Footer() {
    return (
        <div className="footer">
            <div className="footer-box">
                <a href="https://t.me/FomoSwap" target="new_tab"><div className="footer-logo footer-logo1"></div></a>
                <a href="https://twitter.com/RealFOMOSWAP" target="new_tab"><div className="footer-logo footer-logo2"></div></a>
                <a href="https://medium.com/@FOMOSWAP" target="new_tab"><div className="footer-logo footer-logo3"></div></a>
                <a href={"https://tronscan.org/#/token20/" + CONF.fomoAddress} target="_blank"><div className="footer-logo footer-logo4"></div></a>
                <a href={"https://tronscan.org/#/token20/" + CONF.fomox9Address} target="_blank"><div className="footer-logo footer-logo5"></div></a>
                <a href={"https://tronscan.org/#/token20/" + CONF.trc20.mvmPoolAddress} target="_blank"><div className="footer-logo footer-logo6"></div></a>
                <a href={"https://tronscan.org/#/token20/" + CONF.trc20.famPoolAddress} target="_blank"><div className="footer-logo footer-logo7"></div></a>
            </div>
        </div>
    );
}

export default Footer;
