// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

    /*
        www.animals/1
        -> generic image of animal
        -> on-chain json (which updates with upgrades)
        IM pretty confident this works we can change at end worst case
    */

contract AnimalToken is ERC721PresetMinterPauserAutoId, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //add only owner everywhere at the end

    constructor() ERC721PresetMinterPauserAutoId("Jungle Coin", "JGL","www.junglecoins/") public {
    }

    function random(uint256 range) private view returns (uint256) {
        return
            1 + (uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            ) % range);
    }

    enum Species { LION, APE, SNAKE, DOLPHIN, OWL, CHEETAH}

    struct Stats {
        uint256 health;
        uint256 strength;
        uint256 dexterity;
        uint256 intelligence;
        uint256 wisdom;
        uint256 speed;
    }

    struct Animal {
        string name;
        string description;
        Stats data;
        Species species;
        //uint256 tokenId;
        //string URI; //proBABLY DONT NEED
        //string img;
        //coloring...
    }

    //animal should have player... wait i can get from token? what to store... store token id. ownerOf...
    mapping(uint256 => Animal) idToAnimal;
    mapping (address => Animal[]) ownerLions;
    mapping (address => Animal[]) ownerPlebs;

    //mapping(animal => uint256) public animalToId;

    //creates token & struct.
    function generateAnimal(address player, bool isLion) public returns (uint256) {
        //make the nft
        _tokenIds.increment();
        uint256 newAnimalTokenId = _tokenIds.current();
        _mint(player, newAnimalTokenId);
        
        //initialize Stats & species
        uint range = 10;
        Species species;
        Stats memory data = Stats(range*2,random(range),random(range),random(range),random(range),random(range));
        

        if (isLion) {
            species = Species.LION;
            data.health *= 5;
            data.strength *= 5;
            data.dexterity *= 5;
            data.intelligence *= 5;
            data.wisdom *= 5;
            data.speed *= 5;
        }
        else {
            uint num = uint(random(5));
            if (num == 1) {
                species = Species.APE;
                data.strength *= 2;
            }
            else if (num == 2) {
                species = Species.SNAKE;
                data.dexterity *= 2;
            }
            else if (num == 3) {
                species = Species.DOLPHIN;
                data.intelligence *= 2;
            }
            else if (num == 4) {
                species = Species.OWL;
                data.wisdom *= 2;
            }
            else if (num == 5) {
                species = Species.CHEETAH;
                data.speed *= 2;
            }
        }
        

        //make the animal
        idToAnimal[newAnimalTokenId] = Animal("", "", data, species);
        if (isLion) {
            ownerLions[player].push(idToAnimal[newAnimalTokenId]);
        }
        else {
            ownerLions[player].push(idToAnimal[newAnimalTokenId]);
        }

        return newAnimalTokenId;
    } //we use this returned thing as a thing
    
    //name new Animal NFT
    function nameAnimal(uint256 tokenId, string memory name, string memory description) public {
        idToAnimal[tokenId].name = name;
        idToAnimal[tokenId].description = description;
    }

    //get animals (lions or plebs)
    function getAnimals(address player, bool lions) public view returns (Animal[] memory) { //this is ass and will be fixed.
        if (lions) {
            return ownerLions[player];
        }
        else {
            return ownerPlebs[player];
        }
    }


    ////////////////////////////////////////////////////im gonna test some basic animal tokens before I do what im gonna do...
    //////////////////////////////////////////////////////////////////Golden Lions; Spirit of the Owl Upgrade: Wisdom +
    ///so its all animals - golden, and spirits

    //trade / buy / sell (to central etc)

    //upgrade tokens are going in this. isUpgrade means exactly one non-health stat is non-zero. assoicated pleb corresponds

    //gold tokens: all stats 0 except health. lion corresponds

    //lion tokens: means enum is lion and upgrade is false and isGold is false

    //pleb tokens: means enum is not lion and upgrade is false and isGold is false


    //lion tokens
        /*
        generateLion
        isLion
        getLions
        tradeLions
        */

    //pleb tokens
        /*
        generatePleb
        isPleb
        getPlebs
        tradePlebs
        */

    //upgrade tokens
    /*
        generate
        is
        get
        useUpgrade
    */

    //gold tokens
    /*generate is get*/


    //battles : create new upgrade tokens
    //active array for tokens: usable or not, can use time

    //worry about gold + new guys at the end / trading
    //trading: can't involve upgrades
    //can sell to the grave for golden lions
    //trades: pleb + gold => pleb or lion + gold => lion. can't trade upgrades or gold
    //use payable to exchange with someone

}
