import React, {useState, useEffect} from 'react'

import MuiAlert from '@material-ui/lab/Alert'
import Snackbar from '@material-ui/core/Snackbar'

import DetailItem from '../../components/DetailItem/DetailItem'
import MsgBox from '../../components/MsgBox/MsgBox'

import Loading from '../../components/Loading'

import {useLocation} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

// import tigerLogo from '../../assets/tiger-logo.png';
import tigerLogo from '../../assets/1.png'

import wallet from '../../tools/wallet'
import conf from '../../tools/conf'

import {sleep, getUrlParams, formatBigNumber} from '../../tools'

import './Detail.css'

const {poolTitleImg} = require('../../assets/converge')

// 池子标题名字
const poolTitleName = {
    usdtPoolAddress:   'USDT/TRX LP',
    fomoPoolAddress:   'FOMO/TRX LP',
    fomoX9PoolAddress: 'FOMOX9/TRX LP',
    mvmPoolAddress:    'MVM/TRX LP',
    famPoolAddress:    'FAM/TRX LP'
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

function Detail() {

    const {t} = useTranslation()

    // 使用这个变量去区分是哪个池子，个性化设置等、比如图标之类
    // 真不理解为什么不用 pollName 这个变量去做，非要再处理个 src 属性
    const {poolName} = getUrlParams(useLocation().search)

    const [show, setShow]       = useState(false)
    const [popType, setPopType] = useState(0) // 根据状态去判断当前功能、0 批准，1 解压，2质押

    const [obtained, setObtained] = useState(0) // 已获得
    const [pledged, setPledged]   = useState(0) // 已抵押

    // 是否批准，根据 isApproved 这个变量显示显示几个按钮，为 false 一个按钮， true 为两个按钮
    const [isApproved, setApproved] = useState(false)

    const [lpBalance, setLpBalance] = useState(0) // lp 余额

    const [amountSubmitted, setAmountSubmitted] = useState(0) // 提交的金额
    const [isLoading, setLoading]               = useState(true) // 加载状态

    const [openError, setOpenError] = React.useState(false) // 错误提示
    const [errorInfo, setErrorInfo] = React.useState('This is a error!') // 错误提信息

    // 一起更新所有吧
    const upDateAll = async () => {

        if (wallet.getDefaultAddress().code === 0) {

            const myAddress   = wallet.getDefaultAddress().data
            const poolAddress = conf.pool[poolName]
            const lpAddress   = conf.lp[poolName]
// console.log(myAddress)
// console.log(poolAddress)
// console.log(lpAddress)
            const [earnedRes, pledgedRes, allowanceRes, lpRes] = await Promise.all([
                wallet._getEarned(poolAddress),
                wallet._getBalanceOf(poolAddress, myAddress),
                wallet.allowance(lpAddress, myAddress, poolAddress),
                wallet._getBalanceOf(lpAddress, myAddress),
            ])

            setObtained(formatBigNumber(earnedRes.data))

            // if (poolName === 'cornPoolAddress') {
            //     setPledged((Number(formatBigNumber(pledgedRes.data, 1e18))));
            //     setLpBalance((Number(formatBigNumber(lpRes.data, 1e18))));
            // } else {
            //     setPledged(Number(formatBigNumber(pledgedRes.data, 1e6)));
            //     setLpBalance(Number(formatBigNumber(lpRes.data, 1e6)));
            // }
            setPledged(Number(formatBigNumber(pledgedRes.data, 1e6)))
            setLpBalance(Number(formatBigNumber(lpRes.data, 1e6)))

            if (allowanceRes.data.comparedTo(1) > 0) {
                setApproved(true)
            } else {
                setApproved(false)
            }

            setLoading(false)

        } else {

        }

    }

    // 收割
    const onclickHarvest = async () => {
        if (Number(obtained) > 0) {

            // 可以添加 loading 开始，其实就是控制一个变量为 true
            console.log('开始收割')

            await wallet.getReward(conf.pool[poolName]) // 这里可以监听错误

            console.log('收割完成')
            // 结束 loading 开始，其实就是控制一个变量为 false
        }
    }

    // 轮训，更新，10 秒更新一次
    const training = async () => {

        await sleep(20 * 1000)

        for (; ;) {
            try {
                await sleep(8 * 1000)
                await upDateAll()
            } catch (err) {
                console.error(err)
            }
        }
    }

    // 收割并解压
    const onClickExit = async () => {

        if (obtained <= 0) {
            console.log('数量不足')
            // return;
        } else {
            console.log('return')
        }

        // 可以添加 loading 开始，其实就是控制一个变量为 true
        console.log('开始收割并解压')

        await wallet.exit(conf.pool[poolName]) // 这里可以监听错误

        upDateAll()
        console.log('收割并解压完成')
        // 结束 loading 开始，其实就是控制一个变量为 false
    }

    // 批准授权
    const approveAuthor = async () => {

        try {
            // 可以添加 loading 开始，其实就是控制一个变量为 true
            console.log('开始批准授权')

            await wallet.approve(conf.lp[poolName], conf.pool[poolName]) // 这里可以监听错误

            upDateAll()
            console.log('批准授权完成')
            // 结束 loading 开始，其实就是控制一个变量为 false
        } catch (err) {
            console.error(err)
        }

    }

    // 质押
    const invest = async () => {

        if (amountSubmitted <= 0) return

        // 可以添加 loading 开始，其实就是控制一个变量为 true
        console.log('开始质押>>>', amountSubmitted)

        const amount = amountSubmitted

        // if (poolName === 'cornPoolAddress') {
        //     await wallet.safeInvest(conf.pool[poolName], conf.lp[poolName], (amount * 1e18)); // 这里可以监听错误
        // } else {
        //     await wallet.safeInvest(conf.pool[poolName], conf.lp[poolName], (amount * 1e6)); // 这里可以监听错误
        // }
        await wallet.safeInvest(conf.pool[poolName], conf.lp[poolName], (amount * 1e6)) // 这里可以监听错误
        // lp 地址可能不需要，但也要传值

        await sleep(50) // 区块链有延迟 延迟一下再去获取
        setAmountSubmitted(0)
        upDateAll()

        console.log('质押完成')
        // 结束 loading 开始，其实就是控制一个变量为 false
    }

    // 撤出投资
    const withdraw = async () => {

        if (amountSubmitted <= 0) return

        // 可以添加 loading 开始，其实就是控制一个变量为 true
        console.log('开始撤出投资')

        const amount = amountSubmitted

        if (poolName === 'cornPoolAddress') {
            await wallet.withdraw(conf.pool[poolName], (amount * 1e18).toString()) // 这里可以监听错误

        } else {
            await wallet.withdraw(conf.pool[poolName], (amount * 1e6).toString()) // 这里可以监听错误
        }
        // lp 地址可能不需要，但也要传值

        await sleep(50) // 区块链有延迟 延迟一下再去获取
        setAmountSubmitted(0)

        upDateAll()
        console.log('撤出投资完成')
        // 结束 loading 开始，其实就是控制一个变量为 false
    }

    useEffect(() => {
        wallet.eventEmitter.on(wallet.eventConstant.wallet_connection, upDateAll)

        // upDateAll();
        training() // 轮训

        return () => {
            wallet.eventEmitter.removeListener(wallet.eventConstant.wallet_connection, upDateAll)
        }
    }, [])

    // 监听输入框的数据
    const inputHandleChange = (event) => {

        // let curValue = Number(event.target.value);

        setAmountSubmitted(event.target.value)
    }

    const calcAvailable = () => {
        console.log('lpBalance>>>>>', lpBalance)
        if (popType === 1) {
            return `可用：${pledged} ${poolTitleName[poolName]}`
        } else if (popType === 2) {
            return `可用：${lpBalance} ${poolTitleName[poolName]}`
        }
    }

    let msg = <div className="msg-box-body">
        <div>
            <div className="awaylable-money">{calcAvailable()}</div>
            <div className="input-box">
                <input className="input" type="text" value={amountSubmitted} onChange={inputHandleChange}/>
                <div className="max-money btn" onClick={() => {
                    if (popType === 1) {
                        setAmountSubmitted(parseFloat(pledged))
                    } else if (popType === 2) {
                        setAmountSubmitted(parseFloat(lpBalance))
                    }
                }}>{t('detail.max')}</div>
            </div>
        </div>
    </div>

    function showMsgBox(type) {

        console.log(type)
        setPopType(type)

        if (type === 0) {
            approveAuthor()
            return
        }

        setShow(true)
    }

    function confirmCallBack(type) {
        if (type) {
            if (popType === 1) {

                if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(amountSubmitted))) {
                    setErrorInfo(t('detail.insufficientBalance'))
                    setOpenError(true)
                    return
                }

                if (!parseFloat(amountSubmitted)) {
                    setErrorInfo(t('detail.insufficientBalance'))
                    setOpenError(true)
                    return
                }
                if (parseFloat(amountSubmitted) > pledged) {
                    setErrorInfo(t('detail.insufficientBalance'))
                    setOpenError(true)
                    return
                }
                withdraw()
            } else {
                if (!(/^\d+(?=\.{0,1}\d+$|$)/.test(amountSubmitted))) {
                    setErrorInfo(t('detail.insufficientBalance'))
                    setOpenError(true)
                    return
                }

                if (!parseFloat(amountSubmitted)) {
                    setErrorInfo(t('detail.insufficientBalance'))
                    setOpenError(true)
                    return
                }
                if (parseFloat(amountSubmitted) > lpBalance) {
                    setErrorInfo(t('detail.insufficientBalance'))
                    setOpenError(true)
                    return
                }
                invest()
            }
        } else {
            setAmountSubmitted(0)
        }
        setShow(false)
    }

    let detaiItem
    if (!isApproved) {
        detaiItem = <DetailItem src={poolTitleImg[poolName]} number={pledged}
                                text={poolTitleName[poolName] + t('detail.staked')}
                                btnText={t('detail.feed') + poolTitleName[poolName]} onClick={showMsgBox}/>
    } else {
        detaiItem = <DetailItem src={poolTitleImg[poolName]} number={pledged}
                                text={poolTitleName[poolName] + t('detail.staked')} btnText={t('detail.unstake')}
                                btnText2={t('detail.pledge')} onClick={showMsgBox}/>
    }

    const backGround = {
        background:         `url(${poolTitleImg[poolName]})`,
        backgroundRepeat:   'no-repeat',
        backgroundSize:     '100%',
        backgroundPosition: 'center'
    }

    let earn   = ""
    let earned = ""

    if (poolName == "usdtPoolAddress" || poolName == "fomoX9PoolAddress") {
        earn   = t('detail.earn_fomo')
        earned = <DetailItem src={poolTitleImg["fomoTrc20"]} number={obtained} text={t('detail.earned_fomo')}
                             btnText={t('detail.adopt')} onClick={onclickHarvest}/>
    } else {
        earn   = t('detail.earn_fomox9')
        earned = <DetailItem src={poolTitleImg["fomoX9Trc20"]} number={obtained} text={t('detail.earned_fomox9')}
                             btnText={t('detail.adopt')} onClick={onclickHarvest}/>
    }

    const rendering = () => {
        if (isLoading) {
            return (
                <Loading/>
            )
        } else {
            return (
                <>
                    <div className="detai-list">
                        {earned}
                        {detaiItem}
                    </div>

                    <div className="detai-btn btn" onClick={onClickExit}>{t('detail.adoptAndUnstake')}</div>
                </>
            )
        }
    }

    return (
        <div className="detail">
            <div className="detail-slogan">
                <div className="slogan-logo">
                    <div className="slogan-logo-img" style={backGround}></div>
                </div>

                <div className="text-logo">
                    <div className="text-logo-text1">{poolTitleName[poolName]}</div>
                </div>
                <div className="slogan-title">
                    <div>{t('detail.deposit')}</div>
                    <div className="slogan-title-name">&nbsp;{poolTitleName[poolName]}&nbsp;</div>
                    <div>{earn}</div>
                </div>
            </div>
            {rendering()}
            {show && <MsgBox msg={msg} title={t('detail.feed2')} popType={popType} confirm={true}
                             confirmCallBack={confirmCallBack}/>}

            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                open={openError}
                autoHideDuration={1500}
                onClose={setOpenError}>
                <Alert severity="error">
                    {errorInfo}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Detail
