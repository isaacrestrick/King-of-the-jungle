// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    /*
        www.animals/1
        -> generic image of animal
        -> on-chain json (which updates with upgrades)
        IM pretty confident this works we can change at end worst case
    */

contract JungleToken is ERC721PresetMinterPauserAutoId, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    constructor() ERC721PresetMinterPauserAutoId("Jungle Coin", "JGL","www.junglecoins/") public {}

    struct Animal {
        uint8 total_stats;
        uint8 species;
        uint256 id;
        bool jungle;
        address seller_address;
        uint256 seller_tokenId;
    }
    mapping (address => Animal[]) ownerAnimals;
    mapping (uint256 => uint) idToIndex; //isLion is 5 or 1. maybe use random type to make randomization in fights..
    function generateAnimal(address player, uint8 lion) public returns (uint256) {
        _tokenIds.increment();
        uint256 newAnimalTokenId = _tokenIds.current();
        _mint(player, newAnimalTokenId);
        ownerAnimals[player].push(Animal(lion, uint8(1+uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % (6-lion)), newAnimalTokenId,false,player,0));
        idToIndex[newAnimalTokenId] = ownerAnimals[player].length-1;
        return newAnimalTokenId;
    }
    function getAnimalsAndMore(address buyer, uint256 buyerTokenId, bool jungle, address seller, uint256 sellerTokenId) public returns (Animal[] memory) {
        if (ownerAnimals[buyer].length == 0) {
            return ownerAnimals[buyer];
        }
        ownerAnimals[buyer][idToIndex[buyerTokenId]].jungle = jungle;
        /*uint buyerIndex = idToIndex[ownerAnimals[player][]];
        uint sellerIndex = ownerAnimals[player];*/
        //transfer...
        return ownerAnimals[buyer]; 
    }
}