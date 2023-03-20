// SPDX - License - Identifier : MIT

pragma solidity ^ 0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StakingRewards is Ownable,ReentrancyGuard
{
    IERC20 public immutable m_rewardsToken;
    IERC20 public immutable m_stakingToken;
    
    uint public m_uintDuration;
    uint public m_uintFinishAT;
    uint public m_uintUpdatedAt;
    uint private m_uintRewardRate;
    uint public m_uintRewardPerTokenStored;
    mapping(address => uint) public mapUserRewardPerTokenPaid;
    mapping(address => uint) public mapRewards;

    uint public uintTotalSupply;
    mapping(address => uint) private mapBalanceOf;

    modifier updateReward(address addrAccount)
    {
        m_uintRewardPerTokenStored = rewardPerToken();
        m_uintUpdatedAt = lastTimeRewardApplicable();
        if(addrAccount != address(0))
        {
            mapRewards[addrAccount] = earned(addrAccount);
            mapUserRewardPerTokenPaid[addrAccount] = m_uintRewardPerTokenStored;
        }
        _;
    }

    constructor(address addrRewardsToken, address addrStakingToken) 
    {
        m_rewardsToken = IERC20(addrRewardsToken);
        m_stakingToken = IERC20(addrStakingToken);
    }

    function setRewardsDuration (uint uintDuration) external onlyOwner
    {
        require(m_uintFinishAT < block.timestamp, "Rewards duration not finished");
        m_uintDuration = uintDuration;
    }

    function notifyRewardAmount(uint uintAmount) external onlyOwner updateReward(address(0))
    {
        if(block.timestamp > m_uintFinishAT)
        {
            m_uintRewardRate = uintAmount / m_uintDuration;
        }
        else
        {
            uint uintRemainingRewards = m_uintRewardRate * (m_uintFinishAT - block.timestamp);            
            m_uintRewardRate = (uintRemainingRewards + uintAmount) / m_uintDuration;
        }

        require(m_uintRewardRate > 0, "Reward rate is zero");
        require(m_uintRewardRate * m_uintDuration <= m_rewardsToken.balanceOf(address(this)), "Reward Amount > balance");  //TODO, why can't rewards be larger than balance?

        m_uintFinishAT = block.timestamp + m_uintDuration;
        m_uintUpdatedAt = block.timestamp;
        
    }
    
    function stake(uint uintAmount) external updateReward(msg.sender)
    {
        require(uintAmount > 0, "Cannot stake zero amount");
        /*
        require(m_stakingToken.balanceOf(msg.sender) >= uintAmount, "Insufficient balance");
        require(m_stakingToken.allowance(msg.sender, address(this)) >= uintAmount, "Insufficient allowance");
        */

        m_stakingToken.transferFrom(msg.sender, address(this), uintAmount);

        uintTotalSupply += uintAmount;
        mapBalanceOf[msg.sender] += uintAmount;
    }

    function withdraw(uint uintAmount) external nonReentrant updateReward(msg.sender)
    {
        require(uintAmount > 0, "Cannot withdraw zero amount");
        //require(mapBalanceOf[msg.sender] >= uintAmount, "Insufficient balance");

        uintTotalSupply -= uintAmount;
        mapBalanceOf[msg.sender] -= uintAmount;

        m_stakingToken.transfer(msg.sender, uintAmount);
    }

    function lastTimeRewardApplicable() public view returns (uint)
    {
        return _min(block.timestamp, m_uintFinishAT);
    }
    
    function rewardPerToken() public view returns (uint)
    {
        if(uintTotalSupply == 0)
        {
            return m_uintRewardPerTokenStored;
        }

        return m_uintRewardPerTokenStored + (lastTimeRewardApplicable() - m_uintUpdatedAt) * m_uintRewardRate * 1e18 / uintTotalSupply;
    }

    function earned (address addrAccount) public view returns (uint)
    {
        return (mapBalanceOf[addrAccount] * (rewardPerToken() - mapUserRewardPerTokenPaid[addrAccount])) / 1e18 + mapRewards[addrAccount];
    }

    function getReward() external nonReentrant updateReward(msg.sender)
    {
        uint uintReward = mapRewards[msg.sender];
        if(uintReward > 0)
        {
            mapRewards[msg.sender] = 0;
            m_rewardsToken.transfer(msg.sender, uintReward);
        }
    }

    function _min(uint a, uint b) internal pure returns (uint)
    {
        return a <= b ? a : b;
    }

    function balanceOf(address addrBalance) external view returns (uint)
    {
        return mapBalanceOf[addrBalance];
    }

    function getRewardRate() external view returns (uint)
    {
        return m_uintRewardRate;
    }
}