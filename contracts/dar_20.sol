// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DAR20Token is ERC20, Ownable, ERC20Burnable, ReentrancyGuard {
    event tokensBurned(address indexed owner, uint256 amount, string message);
    event tokensMinted(address indexed owner, uint256 amount, string message);
    event additionalTokensMinted(address indexed owner,uint256 amount,string message);
    event votingStarted(address indexed owner, string message);
    event votingEnded(address indexed owner, string message);
    event TcAddressSet(address indexed owner, string message);

    bool m_isVoting = false; //this flag ensures that only one voting can be made at a time.
    
    /********
     * m_strHolder Status is meant to keep the status of the holders
     *  - normal: holder has voted to accept the new terms and conditions or have just newly minted tokens to them. 
     *  - declined: holder has voted to decline the new terms and conditions and the remaining tokens can only be sent to issuer.
    **********/
    mapping (address => bool) m_strHolderIsNormal; //this mapping keep tracks of status of holders.


    /*******************
     * This array keeps track of all the token holders that ever existed. 
     * 
     * The purpose of the array is to keep track of the holders involved in the voting 
     * and defaulting all token holders as not accepting the T&C.
     * 
     * For this usage, its okay if balance of the token holder has gone to 0 from a non 0 value
     * TODO: Improve this design to off load token holders to Merkel Trees. 
     *******************/
    address[] m_arrTokenHolders; 
    bool[] m_arrTokenHoldersStatus; //TODO: Improve this design to off load token holders to Merkel Trees.
    uint256 m_intBalVotedYes; 

    //TODO Improve dependency design.
    address m_addrTcNft; //address of the NFT contract

    string m_strProposeURI;



    constructor() ERC20("Digital Asset Reward ERC20", "DAR20") {
        _mint(msg.sender, 1000 * 10**decimals());
        emit tokensMinted(msg.sender, 1000 * 10**decimals(), "Initial supply of tokens minted.");
    }

    function mint(address to, uint256 amount) public onlyOwner{
        _mint(to, amount);
        m_strHolderIsNormal[to] = true;
        m_arrTokenHolders.push(to);
        emit additionalTokensMinted(msg.sender, amount, "Additional tokens minted.");
    }

    function burn(uint256 amount) public override onlyOwner{
        _burn(msg.sender, amount);
        emit tokensBurned(msg.sender, amount, "Tokens burned.");
    }


}