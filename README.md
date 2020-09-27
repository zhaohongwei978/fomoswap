## Mining

## 部署流程

### 前端部署

### 合约部署
 * 在奖励代币合约(erc20)添加挖矿者 addMinter 接口
 * 调用池子 initialization 接口
 * 查看池子合约和代币合约验证进行数据验证

### 安全审计

       降维科技审计报告v1
以下内容是经我司审计后发现的问题

archivetempTigerSwap.sol:211:
require(msg.sender == governance, "!governance");
//JW: require(_governance != address(0), "governance can't be address(0)");

archivetempTigerSwapPoolUSDT.sol:640:
rewardDistribution = _rewardDistribution;
//JW: require(_rewardDistribution != address(0), "rewardDistribution can't be address(0) !");

archivetempTigerSwapPoolUSDT.sol:713:
rewardPerTokenStored = rewardPerToken();
//JW: \ 第二次stake时, 此时totalSupply不为0, 进入rewardPerToken计算流程, 但是注意lastUpdateTime此时还是0 !!!, periodFinish已经更新为非0, 导致用(block.timestamp - 0) * rewardRate * 1e18/totalsupply

archivetempTigerSwapPoolUSDT.sol:714:
lastUpdateTime = lastTimeRewardApplicable();
//JW: / ----这两句得换下顺序.

archivetempTigerSwapPoolUSDT.sol:783:        
developer = _developer;                                         
//JW: require(_developer != address(0), "developer can't be address(0)");
