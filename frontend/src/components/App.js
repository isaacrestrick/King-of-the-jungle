import React, { useState, useEffect } from "react";
// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";
// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import JungleTokenArtifact from "../contracts/JungleToken.json";
import jungleTokenContractAddress from "../contracts/jungletoken-contract-address.json";
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button,ListGroup,Card,CardGroup,Badge,Navbar,Container} from 'react-bootstrap';

const ROPSTEN_NETWORK_ID = '3';

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  //const [sellerAddress, setSellerAddress] = useState(null); etc.

  const [animals, setAnimals] = useState([]);
  const [jungler, setJungler] = useState([0,false]); //could have big number issue.
  //const [combat, setCombat] = useState(false);


function StatsList(props) {
    const stats = props.stats;
    return(
    <ListGroup variant="flush">
      <ListGroup.Item>total stats of this beastie. Wow! 
        <Badge bg="primary" pill>
        {stats}
        </Badge>
      </ListGroup.Item>
    </ListGroup>
    );
  }
  
  const joinJungle = async (junglerId) => {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    const jungletoken2 = new ethers.Contract(
    jungleTokenContractAddress.JungleToken,
    JungleTokenArtifact.abi,
    provider2.getSigner(0)
    )
    setJungler([junglerId,true]);
    await getAnimals();
  }

  function AnimalCard(props) {
    const animal = props.animal;
    const description = "lion or not here I come!";
    const [showStats,setShowStats] = useState(false);
    let genetics;
    if (animal.species === 0) {
        genetics = 'lion';
    }
    if (animal.species === 1) {
      genetics = 'ape';
  }
  if (animal.species === 2) {
      genetics = 'snake';
  }
  if (animal.species === 3) {
      genetics = 'dolphin';
  }
  if (animal.species === 4) {
      genetics = 'owl';
  }
  if (animal.species === 5) {
      genetics = 'cheetah';
  }
    return(
      <div className="col-3">
        <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{genetics} the {animal.id.toNumber()}th</Card.Title>
              <Card.Text>{description}</Card.Text>
              <Button variant="primary" onClick={() => {setShowStats(!showStats)}}>Show stats</Button>
              {showStats && <StatsList stats={animal.total_stats.toNumber()}/>}
              {animal.jungle && <Button variant="primary" onClick={()=>{joinJungle(animal.id)}}>"Join Jungle"</Button>}
              {animal.jungle && <Card.Text>In the jungle..</Card.Text>}
            </Card.Body>
        </Card>
      </div>
    )
  }

  function AnimalGroup(props) {
    const listOfAnimals = props.animals;
    const title = props.title;
    return (<>
    <Navbar bg="light">
      <Container>
      <Navbar.Text>
          {title}
        </Navbar.Text>
      </Container>
    </Navbar>
      <CardGroup>
        {listOfAnimals.map((animal,i) => (
          <AnimalCard animal = {animal} key={i}/>
        ))}
      </CardGroup>
      </>
    )
  }
/********** */
const connectWallet = async () => {
  const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (window.ethereum.networkVersion !== ROPSTEN_NETWORK_ID) {
    return;
  }
  setWalletAddress(selectedAddress);
  const provider2 = new ethers.providers.Web3Provider(window.ethereum);
  const jungletoken2 = new ethers.Contract(
        jungleTokenContractAddress.JungleToken,
        JungleTokenArtifact.abi,
        provider2.getSigner(0)

  );
  window.ethereum.on("accountsChanged", ([newAddress]) => {
    if (newAddress === undefined) {
      return
    }
    setWalletAddress(selectedAddress);
  });
  window.ethereum.on("chainChanged", ([networkId]) => {
    //resetState();
  });
}//it doesnt do state in the right... state

const addLion = async () => {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    const jungletoken2 = new ethers.Contract(
        jungleTokenContractAddress.JungleToken,
        JungleTokenArtifact.abi,
        provider2.getSigner(0)
    );
  const newLionId = await jungletoken2.generateAnimal(walletAddress,5); //source of randomness!
  const theAnimals = await jungletoken2.getAnimalsAndMore(walletAddress,jungler[0],jungler[1],walletAddress,0);
            setAnimals(theAnimals);

            await getAnimals();

}
const addPleb = async () => {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    const jungletoken2 = new ethers.Contract(
        jungleTokenContractAddress.JungleToken,
        JungleTokenArtifact.abi,
        provider2.getSigner(0)
    );
  const newPlebId = await jungletoken2.generateAnimal(walletAddress,1); //source of randomness!

  await getAnimals();

}
//animal will no longer be random.
const NewLionButton = () => {
  return <Button variant="primary" onClick={() => addLion()}>New Lion</Button>
}
const NewPlebButton = () => {
  return <Button variant="primary" onClick={() => addPleb()}>New Pleb</Button>
}

const Unconnected = () => {
  if (window.ethereum === undefined) {
    return(<NoWalletDetected/>);
  }
  else {
    return(
      <ConnectWallet 
        connectWallet={() => connectWallet()} 
        networkError={false}
        dismiss={() => {"class dismissed."}}
      />
    )
  }
}

const Connected = () => {
  let lions = [];
  let plebs = [];
  for (let i = 0; i < animals.length; i++) {
    let animal = animals[i];
    animal['total_stats'] = animal['total_stats'].toNumber();
    animal['species'] = animal['species'].toNumber();
    //animal['id'] = animal['id'].toNumber();
    //animal['seller_tokenId'] = animal['seller_tokenId'].toNumber();
    //may have to go back to big number later.
    if (animal['species'] === 0) {
        lions.push(animal);
    }
    else {
        plebs.push(animal);
    }
  }
  if (!lions || !plebs) {
    return(<Loading/>);
  }
    return(
    <div>
      <NewLionButton/>
      <NewPlebButton/>
      <div className="container p-4">
        <div className="row">
            <AnimalGroup animals={lions} title = "Lion Collection:"/>
        </div>
        <div className="row">
            <AnimalGroup animals={plebs} title = "Pleb Collection:"/>
        </div>
      </div>
    </div>)

}

useEffect(() => {
    const onLoad = async () => {
      await connectWallet();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
const getAnimals = async () => {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    const jungletoken2 = new ethers.Contract(
          jungleTokenContractAddress.JungleToken,
    JungleTokenArtifact.abi,
          provider2.getSigner(0)
    );
    const theAnimals = await jungletoken2.getAnimalsAndMore(walletAddress,jungler[0],jungler[1],walletAddress,0);
    setAnimals(theAnimals);
    setJungler([0,false]);
    console.log(theAnimals);
}

useEffect(() => {
    if (walletAddress) {
      getAnimals();
    }
  }, [walletAddress]);
return(
  <div>
    {!walletAddress && Unconnected()}
    {walletAddress && Connected()}
  </div>
)

}

export default App;