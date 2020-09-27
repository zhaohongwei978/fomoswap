import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import {useTranslation} from 'react-i18next'

import Slogan from '../../components/Slogan/Slogan'
import StatisticsInfo from '../../components/StatisticsInfo/StatisticsInfo'

import wallet from '../../tools/wallet'
import {formatBigNumber} from '../../tools'

import './Home.css'
import conf from '../../tools/conf'

function Home() {

    const {t} = useTranslation()

    const [myNum, setMyNum]         = useState(0)
    const [myNum1, setMyNum1]       = useState(0)
    const [totalNum, setTotalNum]   = useState(0)
    const [totalNum1, setTotalNum1] = useState(0)

    // const upDateTotalNum = async () => {
    //
    //     if (wallet.getDefaultAddress().code !== 0) {
    //         return
    //     }
    //
    //     const result = await wallet._getTotalSupply(conf.tigerAddress)
    //
    //     if (result.code === 0) {
    //         // setTotalNum(formatBigNumber(result.data)) // 保留两位小数
    //     } else {
    //
    //     }
    // }

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

    const readMint = async () => {
        let total           = 0
        let currentUnixtime = new Date().getTime()

        let usdtStartAt    = await wallet.readMint(conf.pool.usdtPoolAddress)
        let usdtRewardRate = await wallet.rewardRate(conf.pool.usdtPoolAddress)
        let usdtTotal      = Math.floor(((currentUnixtime - (usdtStartAt * 1000)) / 1000) * (usdtRewardRate / 1e18))

        if (usdtTotal > 0) {
            total = usdtTotal
        }

        let fomoX9StartAt    = await wallet.readMint(conf.pool.fomoX9PoolAddress)
        let fomoX9RewardRate = await wallet.rewardRate(conf.pool.fomoX9PoolAddress)
        let fomoX9Total      = Math.floor(((currentUnixtime - (fomoX9StartAt * 1000)) / 1000) * (fomoX9RewardRate / 1e18))

        if (fomoX9Total > 0) {
            total = total + fomoX9Total
        }

        setTotalNum(total)

        let fomoStartAt    = await wallet.readMint(conf.pool.fomoPoolAddress)
        let fomoRewardRate = await wallet.rewardRate(conf.pool.fomoPoolAddress)
        let fomoTotal      = Math.floor(((currentUnixtime - (fomoStartAt * 1000)) / 1000) * (fomoRewardRate / 1e18))

        if (fomoTotal > 0) {
            total = fomoTotal
        }

        let mvmStartAt    = await wallet.readMint(conf.pool.mvmPoolAddress)
        let mvmRewardRate = await wallet.rewardRate(conf.pool.mvmPoolAddress)
        let mvmTotal      = Math.floor(((currentUnixtime - (mvmStartAt * 1000)) / 1000) * (mvmRewardRate / 1e18))

        if (mvmTotal > 0) {
            total = total + mvmTotal
        }

        let famStartAt    = await wallet.readMint(conf.pool.famPoolAddress)
        let famRewardRate = await wallet.rewardRate(conf.pool.famPoolAddress)
        let famTotal      = Math.floor(((currentUnixtime - (famStartAt * 1000)) / 1000) * (famRewardRate / 1e18))

        if (famTotal > 0) {
            total = total + famTotal
        }

        setTotalNum1(total)

        // let startAt         = await wallet.readMint(conf.pool.fomoPoolAddress)
        // let rewardRate      = await wallet.rewardRate(conf.pool.fomoPoolAddress)
        //
        // total = Math.floor(((currentUnixtime - (startAt * 1000)) / 1000) * (rewardRate / 1e18))
        //
        // if (total < 0) {
        //     total = 0
        // }
        //
        // setTotalNum(
        //     total
        // ) // 保留两位小数
        //
        // startAt    = await wallet.readMint(conf.pool.fomoX9PoolAddress)
        // rewardRate = await wallet.rewardRate(conf.pool.fomoX9PoolAddress)
        //
        // total = Math.floor(((currentUnixtime - (startAt * 1000)) / 1000) * (rewardRate / 1e18))
        //
        // if (total < 0) {
        //     total = 0
        // }
        //
        // setTotalNum1(
        //     total
        // ) // 保留两位小数
    }

    useEffect(() => {
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateMyNum)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateMyNum1)
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, readMint)

        // upDateTotalNum()
        // upDateMyNum()
        // readMint()
        setInterval(() => {
            upDateMyNum()
            upDateMyNum1()
            readMint()

            console.log("update ui")
        }, 20 * 1000)

        return () => {
            // wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateTotalNum)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateMyNum)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateMyNum1)
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, readMint)
        }
    }, [])

    return (
        <div className="home">
            <Slogan/>

            <div className="statistics">
                <StatisticsInfo name="balance" number={myNum} text={t('home.balance')}/>
                <StatisticsInfo name="balance1" number={myNum1} text={t('home.balance1')}/>
                {/*<StatisticsInfo name="balance" number={0} text={t('home.balance')}/>*/}
                {/*<StatisticsInfo name="balance1" number={0} text={t('home.balance1')}/>*/}
            </div>

            <div className="statistics">
                <StatisticsInfo name="supply" number={totalNum} text={t('home.supply')}/>
                <StatisticsInfo name="supply1" number={totalNum1} text={t('home.supply1')}/>
                {/*<StatisticsInfo name="supply" number={0} text={t('home.supply')}/>*/}
                {/*<StatisticsInfo name="supply1" number={0} text={t('home.supply1')}/>*/}
            </div>

            <div className="buttons">
                <Link to="/menu">
                    <div className="goto-menu-btn btn">{t('home.see')}</div>
                </Link>

                <a target="__blank" href="https://invite.fomoswap.me">
                    <div className="goto-menu-btn btn">{t('home.see2')}</div>
                </a>
            </div>
        </div>
    )
}

export default Home
