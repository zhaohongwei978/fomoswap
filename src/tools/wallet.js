import conf from './conf'
import EventEmitter from 'eventemitter3'

class Wallet {

    constructor() {

        // tronWeb 对象
        this.tronWrap = window.tronWeb

        // 事件名字常量
        this.eventConstant = {
            wallet_connection: "wallet_connection", // 钱包连接

            // cornPool_balance_update:   conf['pool']['cornPoolAddress'],
            // pearlPool_balance_update:  conf['pool']['pearlPoolAddress'],
            // taiPool_balance_update:    conf['pool']['taiPoolAddress'],
            // usdtPool_balance_update:   conf['pool']['usdtPoolAddress'],
            // tigerPool_balance_update:  conf['pool']['tigerPoolAddress'],
            // tigercPool_balance_update: conf['pool']['tigercPoolAddress'],
        }

        // 数据，在这里获取，使用事件更新 bigNumber , 比较大小使用 comparedTo
        // this.store = {
        //     [conf['pool']['cornPoolAddress']]: {
        //         pawnNum:      0, // 抵押数量
        //         totalPawnNum: 0, // 总抵押数量
        //         rewardNum:    0, // 已获得奖金数
        //         lpTokenNum:   0 // lp token 余额数量
        //     },
        //
        //     [conf['pool']['pearlPoolAddress']]: {
        //         pawnNum:      0, // 抵押数量
        //         totalPawnNum: 0, // 总抵押数量
        //         rewardNum:    0, // 已获得奖金数
        //         lpTokenNum:   0 // lp token 余额数量
        //     },
        //
        //     [conf['pool']['taiPoolAddress']]: {
        //         pawnNum:      0, // 抵押数量
        //         totalPawnNum: 0, // 总抵押数量
        //         rewardNum:    0, // 已获得奖金数
        //         lpTokenNum:   0 // lp token 余额数量
        //     },
        //
        //     [conf['pool']['usdtPoolAddress']]: {
        //         pawnNum:      0, // 抵押数量
        //         totalPawnNum: 0, // 总抵押数量
        //         rewardNum:    0, // 已获得奖金数
        //         lpTokenNum:   0 // lp token 余额数量
        //     },
        //
        //     [conf['pool']['tigerPoolAddress']]: {
        //         pawnNum:      0, // 抵押数量
        //         totalPawnNum: 0, // 总抵押数量
        //         rewardNum:    0, // 已获得奖金数
        //         lpTokenNum:   0 // lp token 余额数量
        //     },
        //
        //     [conf['pool']['tigercPoolAddress']]: {
        //         pawnNum:      0, // 抵押数量
        //         totalPawnNum: 0, // 总抵押数量
        //         rewardNum:    0, // 已获得奖金数
        //         lpTokenNum:   0 // lp token 余额数量
        //     }
        //
        // }

        // 事件管理器
        this.eventEmitter = new EventEmitter()

        this._init()
    }

    _init() {
        const timerRec = setInterval(() => {
            if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
                clearInterval(timerRec)
                this.tronWrap = window.tronWeb

                this.eventEmitter.emit(this.eventConstant.wallet_connection) // 派发钱包连接事件

                // 获得钱包后监听、网络、账户、节点等变化
                // window.addEventListener('message', function (e) {
                //   if (e.data.message && e.data.message.action == "tabReply") {
                //     window.location.reload();
                //   }

                //   if (e.data.message && e.data.message.action == "setAccount") {
                //     window.location.reload();
                //   }

                //   if (e.data.message && e.data.message.action == "setNode") {
                //     window.location.reload();
                //   }
                // });
            }
        }, 10)
    }

    // 获取默认地址
    getDefaultAddress() {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        return {
            code: 0,
            data: this.tronWrap.defaultAddress.base58
        }
    }

    /**
     * 根据合约地址查询余额
     * 查询余额 balanceOf(address account) view
     *
     * @param {string} contractAddress 合约地址
     * @param {string} myAccount 查询谁的账户
     */
    async _getBalanceOf(contractAddress, myAccount) {

        if (typeof this.tronWrap === 'undefined' || this.getDefaultAddress().code === -1) {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const args = [
            {
                type:  "address",
                value: myAccount
            }
        ]

        const result = await this.tronWrap
            .transactionBuilder
            .triggerConstantContract(
                contractAddress,
                "balanceOf(address)",
                {},
                args,
                this.getDefaultAddress().data
            )

        return {
            code: 0,
            data: this.tronWrap.toBigNumber("0x" + result.constant_result[0])
        }
    }

    /**
     * 根据合约地址查询总量
     * 查询总量 totalSupply() view
     *
     * @param {string} contractAddress 合约地址
     */
    async _getTotalSupply(contractAddress) {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const contract = await this.tronWrap.contract().at(contractAddress)
        const result   = await contract.totalSupply().call()

        console.log('根据合约地址查询总量>>>', result)

        return {
            code: 0,
            data: this.tronWrap.toBigNumber(result._hex)
        }
    }

    /**
     * 根据合约地址查询、我的奖励
     * 我的奖励 earned(address account) view
     * @param {string} contractAddress 合约地址
     * @param {string} myAccount 查询谁的账户
     */
    async _getEarned(contractAddress, myAccount) {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const contract = await this.tronWrap.contract().at(contractAddress)

        const result = await contract.earned(this.getDefaultAddress().data).call()

        console.log('根据合约地址查询、我的奖励>>>', result)

        return {
            code: 0,
            data: this.tronWrap.toBigNumber(result._hex)
        }
    }

    /**
     * 根据合约地址、存款
     * 存款 stake(uint256 amount)
     * @param {string} contractAddress 合约地址
     * @param {number} myNum 查询谁的账户
     */
    async stake(contractAddress, myNum) {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const contract = await this.tronWrap.contract().at(contractAddress)

        // myNum 处理下精度、单位转换问题
        const result = await contract.stake(this.tronWrap.toBigNumber(myNum).toString(10)).send({
            feeLimit:           1e8,
            callValue:          0,
            shouldPollResponse: !0
        })

        console.log('根据合约地址、存款>>>', result)

        return result
    }

    /**
     * 根据合约地址、安全的存款。检验是否授权
     * 存款 safeInvestment(uint256 amount)
     * @param {string} lpAddress lp 合约地址
     * @param {string} contractAddress 合约地址
     * @param {number} myNum 查询谁的账户
     */
    async safeInvest(contractAddress, lpAddress, myNum) {

        return await this.stake(contractAddress, myNum)

    }


    /**
     * 根据合约地址、撤出资金池
     * 存款 withdraw(uint256 amount)
     * @param {string} contractAddress 合约地址
     * @param {number} myNum 查询谁的账户
     */
    async withdraw(contractAddress, myNum) {
        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const contract = await this.tronWrap.contract().at(contractAddress)

        // myNum 处理下精度、单位转换问题
        const result = await contract.withdraw(this.tronWrap.toBigNumber(myNum).toString(10)).send({
            feeLimit:           1e8,
            callValue:          0,
            shouldPollResponse: !0
        })

        console.log('根据合约地址、撤出资金池>>>', result)

        return result
    }

    /**
     * 根据合约地址、领取奖励
     * 领取奖励 getReward()
     * @param {string} contractAddress 合约地址
     */
    async getReward(contractAddress) {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const contract = await this.tronWrap.contract().at(contractAddress)

        const result = await contract.getReward().send({
            feeLimit:           1e8,
            callValue:          0,
            shouldPollResponse: !0
        })

        console.log('根据合约地址、领取奖励>>>', result)

        return result
    }

    /**
     * 根据合约地址、退出
     * 领取奖励 exit()
     * @param {string} contractAddress 合约地址
     */
    async exit(contractAddress) {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const contract = await this.tronWrap.contract().at(contractAddress)

        const result = await contract.exit().send({
            feeLimit:           1e8,
            callValue:          0,
            shouldPollResponse: !0
        })

        console.log('根据合约地址、退出>>>', result)

        return result
    }

    /**
     * 根据合约地址、授权金额
     * 授权金额 "approve(address,uint256)"
     * @param {string} contractAddress 合约地址
     * @param {string} spendAccount 花钱的人地址
     * @param {number} myNum 数量
     */
    async approve(contractAddress, spendAccount, myNum) {

        if (typeof this.tronWrap === 'undefined' || this.getDefaultAddress().code === -1) {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const r = [
            {
                type:  "address",
                value: spendAccount
            }, {
                type:  "uint256",
                value: "115792089237316195423570985008687907853269984665640564039457584007913129639934"
            }
        ]

        const result = await this.tronWrap
            .transactionBuilder
            .triggerSmartContract(
                contractAddress,
                "approve(address,uint256)",
                {},
                r,
                this.getDefaultAddress().data
            )

        const aaa = await this.tronWrap.trx.sign(result.transaction)
        const bb  = this.tronWrap.trx.sendRawTransaction(aaa)
        console.log('根据合约地址、授权金额>>>', bb)

        return bb
    }

    /**
     * 根据合约地址查询、查询授权金额
     * 查询授权金额 "allowance(address,address)" 我的钱可以谁花
     * @param {string} contractAddress 合约地址
     * @param {string} myAccount 我的钱
     * @param {string} spendAccount 可以花钱的人
     */
    async allowance(contractAddress, myAccount, spendAccount) {

        if (typeof this.tronWrap === 'undefined') {
            return {
                code: -1,
                msg:  '未连接钱包'
            }
        }

        const arg = [
            {
                type:  "address",
                value: this.getDefaultAddress().data
            }, {
                type:  "address",
                value: spendAccount
            }
        ]

        const result = await this.tronWrap
            .transactionBuilder
            .triggerConstantContract(
                contractAddress,
                "allowance(address,address)",
                {},
                arg,
                this.getDefaultAddress().data
            )

        return {
            code: 0,
            data: this.tronWrap.toBigNumber("0x" + result.constant_result[0])
        }

    }

    /**
     * 获取单个池子目前 totalSupply
     * @param {string} contractAddress 合约地址
     * @returns {Promise<void>}
     */
    async poolTotal(contractAddress) {
        const contract = await this.tronWrap.contract().at(contractAddress)

        const result = await contract.totalSupply().call()

        console.log('根据合约地址、获取 totalSupply>>>', result)

        return this.tronWrap.toDecimal(result)
    }

    getLP(contractName) {
        return new Promise((resolve, reject) => {
            let trigger = this.tronWrap.transactionBuilder.triggerConfirmedConstantContract(contractName, `totalSupply()`, {})

            trigger.then(tx => {
                if (!tx.result.result) {
                    reject("result is false")
                }

                let amount = this.tronWrap.toDecimal("0x" + tx.constant_result[0])

                resolve(amount)
            }).catch(err => {
                reject(err)
            })
        })
    }

    // lp 占 erc20 数量
    getContractToUSDT(erc20Contract, lPContract) {
        return new Promise((resolve, reject) => {
            const trigger = this.tronWrap.transactionBuilder.triggerConfirmedConstantContract(erc20Contract, `balanceOf(address)`, {},
                [
                    {
                        type:  `address`,
                        value: lPContract,
                    }
                ], lPContract)

            trigger.then(tx => {
                if (!tx.result.result) {
                    throw new Error(`result is false`)
                }

                let amount = this.tronWrap.toDecimal("0x" + tx.constant_result[0])

                resolve(amount)
                // console.log(tronWeb.fromSun(amount))
            }).catch(err => {
                reject(err)
            })
        })
    }

    getTrxToTokenPrice(lpContract, quantity) {
        return new Promise((resolve, reject) => {
            let trigger = this.tronWrap.transactionBuilder.triggerConfirmedConstantContract(lpContract, `getTokenToTrxOutputPrice(uint256)`, {},
                [
                    {
                        type:  `uint256`,
                        value: quantity,
                    }
                ])

            trigger.then(async tx => {
                let amount = this.tronWrap.toDecimal("0x" + tx.constant_result[0])

                resolve(amount)
            }).catch(err => {
                reject(err)
            })

        })
    }

    getTokenUSDTPrice(lpContract, quantity) {
        return new Promise((resolve, reject) => {
            let trigger = this.tronWrap.transactionBuilder.triggerConfirmedConstantContract(lpContract, `getTrxToTokenInputPrice(uint256)`, {},
                [
                    {
                        type:  `uint256`,
                        value: quantity,
                    }
                ])

            trigger.then(async tx => {
                let amount = this.tronWrap.toDecimal("0x" + tx.constant_result[0])

                resolve(amount)
            }).catch(err => {
                reject(err)
            })

        })
    }

    /*
    * 池子 a 年化
    * poolContract TQiGSmof81YPCYWzaPT8aTmMEt82dGymAt
    * lpContract TWhR2Be1XLGa4z8xgvPDvfArA1pmCtz6Tq
    * trc20Contract THRBFeEwKUoREVJCFpLm7JF4ph24bZAVDG
    *
    * fieldRate 1天挖矿速率
    * */
    async poolYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, fixedRate) {
        console.log(trc20Contract, poolContract, lpContract, baseTokenContract)

        let myLP   = await this.getLP(poolContract)
        let fullLP = await this.getLP(lpContract)
        let ratio  = myLP / fullLP

        console.log("myLP: " + myLP)
        console.log("fullLP: " + fullLP)
        console.log("占比: " + ratio)

        console.log(trc20Contract, lpContract)

        let lpTotal = await this.getContractToUSDT(trc20Contract, lpContract)
        lpTotal     = lpTotal / 1e18

        console.log("LP 占 trc20 数量: " + lpTotal)

        let tig = await this.getTrxToTokenPrice(baseTokenContract, 1)
        tig     = 1 / (tig / 1e12)

        let toTrx = await this.getTrxToTokenPrice(lpContract, 1)
        toTrx     = 1 / (toTrx / 1e12)

        let a = (ratio * (lpTotal * 2) * toTrx)

        console.log("1 token: " + tig + "trx")
        console.log("1 token to trx: " + toTrx + "trx")
        console.log("a市值: " + a)

        fixedRate = fixedRate || 0

        let usdtToTrx = await this.getTokenUSDTPrice("TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", 1e6)
        usdtToTrx     = usdtToTrx / 1e6
        console.log("1 trx: " + usdtToTrx + "usdt")

        let a_rate = (fixedRate * tig) / a

        console.log("a_rate: " + a_rate)

        // console.log("年化: " + Math.pow(a_rate + 1, 356) * 100)
        let yearRate = ((a_rate + 1) * 356) * 100

        console.log("年化: " + yearRate)
        console.log("----------")

        return new Promise((resolve, reject) => {
            resolve(Math.floor(yearRate))
        })
    }

    async poolUSDTYearRate(trc20Contract, poolContract, lpContract, baseTokenContract, fixedRate) {
        console.log(trc20Contract, poolContract, lpContract, baseTokenContract)

        let myLP   = await this.getLP(poolContract)
        let fullLP = await this.getLP(lpContract)
        let ratio  = myLP / fullLP

        console.log("myLP: " + myLP)
        console.log("fullLP: " + fullLP)
        console.log("占比: " + ratio)

        let lpTotal = await this.getContractToUSDT(trc20Contract, lpContract)
        lpTotal     = lpTotal / 1e6

        console.log("LP 占 trc20 数量: " + lpTotal)


        let a = ratio * (lpTotal * 2)

        console.log("a市值: " + a)

        // let fieldRate = 642857
        fixedRate = fixedRate || 0

        let tig = await this.getTrxToTokenPrice(baseTokenContract, 1)
        tig     = 1 / (tig / 1e12)
        console.log("1 token: " + tig + "trx")

        let usdtToTrx = await this.getTokenUSDTPrice("TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", 1e6)
        usdtToTrx     = usdtToTrx / 1e6
        console.log("1 trx: " + usdtToTrx + "usdt")

        // myLP: 98455000
        // wallet.js:565 fullLP: 2118588115628446
        // wallet.js:566 占比: 4.647198729838757e-8
        // wallet.js:571 LP 占 trc20 数量: 64125433.456946
        // wallet.js:532 1 token: 0.0169127445614111trx
        // wallet.js:576 a市值: 5.960072658229584
        // wallet.js:593 a_rate: 5.056624220777389
        // wallet.js:598 年化: 215615.82225967504

        let a_rate = (fixedRate * tig * usdtToTrx) / a

        console.log("a_rate: " + a_rate)

        // console.log("年化: " + Math.pow(a_rate + 1, 356) * 100)
        let yearRate = ((a_rate + 1) * 356) * 100

        console.log("年化: " + yearRate)
        console.log("----------")

        return new Promise((resolve, reject) => {
            resolve(Math.floor(yearRate))
        })
    }


    async readMint(contractAddress) {
        const contract = await this.tronWrap.contract().at(contractAddress)

        const result = await contract.starttime().call()

        return this.tronWrap.toDecimal(result)
    }

    async rewardRate(contractAddress) {
        const contract = await this.tronWrap.contract().at(contractAddress)

        const result = await contract.rewardRate().call()

        return this.tronWrap.toDecimal(result)
    }
}

export default new Wallet()
