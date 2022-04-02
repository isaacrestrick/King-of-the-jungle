// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
contract lion is ERC721
{
    using Counters for Counters.Counter;    
    Counters.Counter private _tokenIds;
    unit256 public strength;
    unit256 public speed;
    unit256 public wisdom;
    unit256 public dexterity;
    unit256 public intelligence;
    

}