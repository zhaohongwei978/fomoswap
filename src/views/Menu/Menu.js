import React, {useState, useEffect} from 'react'
import './Menu.css'

import {useTranslation} from 'react-i18next'
import CONF from '../../tools/conf'

import Slogan from '../../components/Slogan/Slogan'
import ListItem from '../../components/ListItem/ListItem'

import cTime from '../../config/cTime.json'

// import TigerPdf from '../../assets/TigerSwap-PDF.pdf'
import wallet from '../../tools/wallet'
import conf from '../../tools/conf'
import {formatBigNumber} from "../../tools"
import numbro from "numbro"
import apy from "../../tools/apy"


function Menu() {
    numbro.languages()
    const {t} = useTranslation()

    const [now, setNow] = useState(Date.parse(new Date()))

    const defaultPoolValue = "-"
    let amount             = 0

    const [usdtPoolTotal, setUsdtPoolTotal]     = useState(defaultPoolValue)
    const [fomoPoolTotal, setFomoPoolTotal]     = useState(defaultPoolValue)
    const [fomoX9PoolTotal, setFomoX9PoolTotal] = useState(defaultPoolValue)
    const [mvmPoolTotal, setMvmPoolTotal]       = useState(defaultPoolValue)
    const [famPoolTotal, setFamPoolTotal]       = useState(defaultPoolValue)

    const upDateYearReate1 = () => {
        const poolContract      = conf.pool.usdtPoolAddress
        const lpContract        = conf.lp.usdtPoolAddress
        const trc20Contract     = conf.trc20.usdtPoolAddress
        const baseTokenContract = conf.lp.fomoPoolAddress

        // console.log(poolContract)
        // console.log(lpContract)
        // console.log(trc20Contract)

        wallet.poolUSDTYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, 71428.57).then(yearRate => {
            if (yearRate == "Infinity") {
                setUsdtPoolTotal("-")
            } else {
                setUsdtPoolTotal(yearRate + "%")
            }
        })
    }

    const upDateYearReate2 = () => {
        const poolContract      = conf.pool.fomoPoolAddress
        const lpContract        = conf.lp.fomoPoolAddress
        const trc20Contract     = conf.trc20.fomoPoolAddress
        const baseTokenContract = conf.lp.fomoX9PoolAddress

        wallet.poolYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, 357142.85).then(yearRate => {
            if (yearRate == "Infinity") {
                setFomoPoolTotal("-")
            } else {
                setFomoPoolTotal(yearRate + "%")
            }
        })
    }

    const upDateYearReate3 = () => {
        const poolContract      = conf.pool.fomoX9PoolAddress
        const lpContract        = conf.lp.fomoX9PoolAddress
        const trc20Contract     = conf.trc20.fomoX9PoolAddress
        const baseTokenContract = conf.lp.fomoPoolAddress

        wallet.poolYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, 642857.14).then(yearRate => {
            if (yearRate == "Infinity") {
                setFomoX9PoolTotal("-")
            } else {
                setFomoX9PoolTotal(yearRate + "%")
            }
        })
    }

    const upDateYearReate4 = () => {
        const poolContract      = conf.pool.mvmPoolAddress
        const lpContract        = conf.lp.mvmPoolAddress
        const trc20Contract     = conf.trc20.mvmPoolAddress
        const baseTokenContract = conf.lp.fomoX9PoolAddress

        wallet.poolYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, 71428.57).then(yearRate => {
            if (yearRate == "Infinity") {
                setMvmPoolTotal("-")
            } else {
                setMvmPoolTotal(yearRate + "%")
            }
        })
    }

    const upDateYearReate5 = () => {
        const poolContract      = conf.pool.famPoolAddress
        const lpContract        = conf.lp.famPoolAddress
        const trc20Contract     = conf.trc20.famPoolAddress
        const baseTokenContract = conf.lp.fomoX9PoolAddress

        wallet.poolYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, 285714.28).then(yearRate => {
            if (yearRate == "Infinity") {
                setFamPoolTotal("-")
            } else {
                setFamPoolTotal(yearRate + "%")
            }
        })
    }

    useEffect(() => {

        function clock() {
            setNow(Date.parse(new Date()))
        }

        const timer = setInterval(clock, 1000)

        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateYearReate1)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateYearReate2)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateYearReate3)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateYearReate4)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateYearReate5)

        setInterval(() => {
            upDateYearReate1()
            upDateYearReate2()
            upDateYearReate3()
            upDateYearReate4()
            upDateYearReate5()

            console.log("update ui")
        }, 20 * 1000)

        return () => {
            clearInterval(timer)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateYearReate1)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateYearReate2)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateYearReate3)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateYearReate4)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateYearReate5)
        }
    }, [])

    return (
        <div className="menu">

            {/*<div className="menu-addr">
                <a href="https://johnwick.io/verify/5d7d213e30f779f3ea05b595a53ed7b1"
                   target="new_tab">{t('park.TIG_Audit_Report')}</a><span></span>
                <a href="https://johnwick.io/verify/6270f43eff2e0d275717aea895ea9062"
                   target="new_tab">{t('park.TIG_Pool_Audit_Report')}</a><span></span>
                <a href={TigerPdf} target="new_tab">{t('park.Reports_Details')}</a>
            </div>*/}

            <Slogan/>

            {/* <div className="menu-addr">
                <div>{t('park.address')}:</div>
                <a target="new_tab" href={"https://tronscan.org/#/token20/" + CONF.fomoAddress}>{CONF.fomoAddress}</a>
            </div>
            <div className="menu-addr">
                <div>{t('park.address1')}:</div>
                <a target="new_tab"
                   href={"https://tronscan.org/#/token20/" + CONF.fomox9Address}>{CONF.fomox9Address}</a>
            </div>*/}

            <div className="tokens-list">
                <ListItem cTime={cTime.usdt} is_usdt={true} title="USDT/TRX LP" now={now} poolName='usdtPoolAddress'
                          total={usdtPoolTotal}/>
                <ListItem cTime={cTime.fomo} is_fomo={true} title="FOMO/TRX LP" now={now} poolName='fomoPoolAddress'
                          total={fomoPoolTotal}/>
                <ListItem cTime={cTime.fomox9} is_fomox9={true} title="FOMOX9/TRX LP" now={now}
                          poolName='fomoX9PoolAddress'
                          total={fomoX9PoolTotal}/>
                <ListItem cTime={cTime.mvm} is_mvm={true} title="MVM/TRX LP" now={now} poolName='mvmPoolAddress'
                          total={mvmPoolTotal}/>
                <ListItem cTime={cTime.fam} is_fam={true} title="FAM/TRX LP" now={now} poolName='famPoolAddress'
                          total={famPoolTotal}/>
            </div>
        </div>
    )
}

export default Menu
