import React, {useState, useEffect} from 'react'

import {Link, NavLink} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import wallet from '../../tools/wallet'
import {formatBigNumber} from '../../tools'
import conf from '../../tools/conf'

import './Header.css'
import MsgBox from '../MsgBox/MsgBox'
import logo from './../../assets/logo.png'

function Header() {

    const {t, i18n} = useTranslation()

    const [show, setShow] = useState(false)
    const [key, setKey]   = useState(1111)

    const [myNum, setMyNum]   = useState(0)
    const [myNum1, setMyNum1] = useState(0)

    let msg = <div className="msg-box-body">
        <div className="msg-box-wrap">
            <div className="msg-box-container">
                <div className="msg-box-icon-area">
                    <i className="msg-box-icon2"></i>
                </div>
                <div>
                    <div className="statistics-info-text-number">{myNum}</div>
                    <div className="statistics-info-text-title">{t('header.balance')}</div>
                </div>
            </div>

            <div className="msg-box-container">
                <div className="msg-box-icon-area">
                    <i className="msg-box-icon3"></i>
                </div>
                <div>
                    <div className="statistics-info-text-number">{myNum1}</div>
                    <div className="statistics-info-text-title">{t('header.balance1')}</div>
                </div>
            </div>
        </div>
    </div>

    function showWallet() {
        setShow(true)
        setKey(key + 1)
    }

    const upDateMyNum = async () => {

        if (wallet.getDefaultAddress().code !== 0) {
            return
        }

        const result = await wallet._getBalanceOf(conf.fomoAddress, wallet.getDefaultAddress().data)

        if (result.code === 0) {
            setMyNum(formatBigNumber(result.data)) // 保留两位小数
        } else {

        }
    }

    const upDateMyNum1 = async () => {

        if (wallet.getDefaultAddress().code !== 0) {
            return
        }

        const result = await wallet._getBalanceOf(conf.fomox9Address, wallet.getDefaultAddress().data)

        if (result.code === 0) {
            setMyNum1(formatBigNumber(result.data)) // 保留两位小数
        } else {

        }
    }

    useEffect(() => {
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateMyNum)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateMyNum1)

        // upDateMyNum();

        return () => {
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateMyNum)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateMyNum1)
        }
    }, [])

    const changeLanguage = lng => {
        i18n.changeLanguage(lng)
    }

    return (
        <div>
            <header className="header">
                <div className="logo-box">
                    <Link to="/">
                        <div className="logo"><img src={logo} alt="logo"/></div>
                    </Link>
                </div>

                <ul className="nav">
                    <li className="nav-item">
                        <NavLink exact to="/">{t('header.home')}</NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink exact to="/menu">{t('header.park')}</NavLink>
                    </li>

                    {/*<li className="nav-item"><a target="new_tab" href="https://medium.com/@FOMOSWAP">{t('header.more')}</a></li>*/}
                    <li className="nav-item"><a target="_blank" href="https://invite.fomoswap.me">{t('header.more')}</a></li>

                    <li className="nav-item"><a target="_blank" href="https://forms.gle/KtNNtJeLrSZfgm257">{t('header.airdrop')}</a></li>
                    <li className="nav-item"><a target="_blank" href="https://medium.com/@FOMOSWAP">{t('header.about')}</a></li>
                </ul>

                <div className="header-right">
                    <div className="vollet-btn btn" onClick={showWallet}>{t('header.wallet')}</div>

                    <div className="lan-choose">
                        <div className="lan-text">{t('header.lan')}</div>
                        <div className="lan-en" onClick={() => changeLanguage('en')}></div>
                        <div className="lan-cn" onClick={() => changeLanguage('zh')}></div>
                    </div>
                </div>

            </header>

            <ul className="nav-mob">
                <li className="nav-item">
                    <NavLink exact to="/">{t('header.home')}</NavLink>
                </li>

                <li className="nav-item">
                    <NavLink exact to="/menu">{t('header.park')}</NavLink>
                </li>

                {/*<li className="nav-item"><a target="__blank" href="https://medium.com/@FOMOSWAP">{t('header.more')}</a></li>*/}
                <li className="nav-item"><a target="_blank" href="https://invite.fomoswap.me">{t('header.more')}</a></li>

                <li className="nav-item"><a target="_blank" href="https://forms.gle/KtNNtJeLrSZfgm257">{t('header.airdrop')}</a></li>
                <li className="nav-item"><a target="_blank" href="https://medium.com/@FOMOSWAP">{t('header.about')}</a></li>
            </ul>

            {show && <MsgBox msg={msg} title={t('header.account')} key={key} confirmCallBack={() => setShow(false)}/>}
            {/* {msg_box} */}
        </div>
    )
}

export default Header
