import React from 'react'
import {Link} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

import './ListItem.css'

const {poolTitleImg} = require('../../assets/converge')

function ListItem(props) {

    const {t} = useTranslation()

    // 最好使用解构复制，title 也是一样的，这样你使用了哪些变量在一开始就能找出来
    const {poolName} = props

    const routingParam = {
        pathname: '/detail',
        search:   `?poolName=${poolName}`
    }

    const backGround = {
        background:         `url(${poolTitleImg[poolName]})`,
        backgroundRepeat:   'no-repeat',
        backgroundSize:     '100%',
        backgroundPosition: 'center'
    }

    let chooseBtn
    let leftTime
    let now = props.now

    if (now > props.cTime.end_time) {
        chooseBtn = <div className="choose-btn btn gray">{t('park.finished')}</div>
        leftTime  = <div className="choose-area-time">0 {t('park.day')} 00 : 00 : 00</div>
    } else {
        if (now < props.cTime.start_time) {
            chooseBtn = <div className="choose-btn btn gray">{t('park.notstartted')}</div>
        } else {
            chooseBtn = <Link to={routingParam}>
                <div className="choose-btn btn">{t('park.select')}</div>
            </Link>
        }
        let lftTime = (props.cTime.end_time - now) / 1000

        // 临时屏蔽
        // chooseBtn = <div className="choose-btn btn gray">{t('park.notstartted')}</div>

        // 延后2个小时
        // lftTime = lftTime + (60 * 60 * 2)

        //6048000000    十周时间的毫秒数
        const ONE_MINUTE = 60
        const ONE_HOUR   = ONE_MINUTE * 60
        const ONE_DAY    = ONE_HOUR * 24
        const ONE_WEEK   = ONE_DAY * 7

        let days    = lftTime % (ONE_WEEK * 1) / ONE_DAY
        let hours   = lftTime % ONE_DAY / ONE_HOUR
        let minutes = lftTime % ONE_HOUR / ONE_MINUTE
        let seconds = lftTime % ONE_MINUTE

        leftTime = <div
            className="choose-area-time">{parseInt(days)} {t('park.day')} {parseInt(hours)} : {parseInt(minutes)} : {seconds}</div>
    }

    let tokensText = ""

    if (props.is_usdt) {
        tokensText = <div
            className="tokens-item-text">{t('park.usdt')}</div>
    }

    if (props.is_fomo) {
        tokensText = <div
            className="tokens-item-text">{t('park.fomo')}</div>
    }

    if (props.is_fomox9) {
        tokensText = <div
            className="tokens-item-text">{t('park.fomox9')}</div>
    }

    if (props.is_mvm) {
        tokensText = <div
            className="tokens-item-text">{t('park.mvm')}</div>
    }

    if (props.is_fam) {
        tokensText = <div
            className="tokens-item-text">{t('park.fam')}</div>
    }

    return (
        <div className="tokens-list-item">
            <div className="tokens-item">
                <div className="tokens-item-logo">
                    <span style={backGround}></span>
                </div>

                <div className="tokens-item-title">{props.title}</div>
                <div className="tokens-item-text">{t('park.deposit')}&nbsp;{props.title}</div>
                {tokensText}

                <div className="choose-area">
                    <div className="choose-area-time-box">
                        <div className="choose-area-time-icon"></div>
                        {leftTime}
                    </div>
                    {chooseBtn}
                </div>

                <div className="apy-box">
                    <div>{t('park.total')}</div>
                    <div>{props.total}</div>
                </div>
            </div>
        </div>
    )
}

export default ListItem
