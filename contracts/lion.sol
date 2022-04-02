// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract lion is ERC721,Ownable
{
    struct stats
    {
        uint speed;
        uint strength;
        uint wisdom;
        uint dexterity;
        uint intelligence;
    }

    using Counters for Counters.Counter;  

    Counters.Counter private _tokenIds;
    mapping (uint256 => stats) public IdtoStats;
    mapping (uint256 => string) public IdtoNames;

    constructor() ERC721("LionNFT", "LIO") {}
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)))%25;
    }
    function genLion(address receiver, string memory tokenURI,string memory _name) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        IdtoNames[newNftTokenId]=_name;
   
        _mint(receiver, newNftTokenId);
        _setTokenURI(newNftTokenId, tokenURI);

        return newNftTokenId;
    }


}