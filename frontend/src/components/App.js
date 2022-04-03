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

function StatsList(props) {
  const stats = props.stats;
  return(
  <ListGroup variant="flush">
    <ListGroup.Item>health 
      <Badge bg="primary" pill>
      {stats[0].toNumber()}
      </Badge>
    </ListGroup.Item>

    <ListGroup.Item>strength 
      <Badge bg="primary" pill>
      {stats[1].toNumber()}
      </Badge>
    </ListGroup.Item>

    <ListGroup.Item>dexterity 
      <Badge bg="primary" pill>
      {stats[2].toNumber()}
      </Badge>
    </ListGroup.Item>

    <ListGroup.Item>intelligence 
      <Badge bg="primary" pill>
      {stats[3].toNumber()}
      </Badge>
    </ListGroup.Item>

    <ListGroup.Item>wisdom 
      <Badge bg="primary" pill>
      {stats[4].toNumber()}
      </Badge>
    </ListGroup.Item>

    <ListGroup.Item>speed 
      <Badge bg="primary" pill>
      {stats[5].toNumber()}
      </Badge>
    </ListGroup.Item>
  </ListGroup>
  );
}

function AnimalCard(props) {
  const animal = props.animal;
  const description = props.description;
  const [showStats,setShowStats] = useState(false);

  return(
    <div className="col-3">
      <Card style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{animal['name']}</Card.Title>
            <Card.Text>{animal['name']} is a <b>{animal.species}</b></Card.Text>
            <Card.Text>{animal['description']}</Card.Text>
            <Button variant="primary" onClick={() => {setShowStats(!showStats)}}>Show stats</Button>
            {showStats && <StatsList stats={animal['data']}/>}
          </Card.Body>
      </Card>
    </div>
  )
}

function AnimalGroup(props) {
  const animals = props.animals;
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
      {animals.map((animal,i) => (
        <AnimalCard animal = {animal} key={i}/>
      ))}
    </CardGroup>
    </>
  )
}

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [lions, setLions] = useState([]);
  const [plebs, setPlebs] = useState([]);


const connectWallet = async () => {
  const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  if (window.ethereum.networkVersion != ROPSTEN_NETWORK_ID) {
    return;
  }
  setWalletAddress(selectedAddress);
  const provider2 = new ethers.providers.Web3Provider(window.ethereum);
  const jungletoken2 = new ethers.Contract(
        jungleTokenContractAddress.JungleToken,
        JungleTokenArtifact.abi,
        provider2.getSigner(0)
  );
  //const wait_for_lions = await jungletoken2.getAnimals(selectedAddress,true);
  //setLions(wait_for_lions);
  //const wait_for_plebs = await jungletoken2.getAnimals(selectedAddress,false);
  //setLions(wait_for_plebs);
  window.ethereum.on("accountsChanged", ([newAddress]) => {
    if (newAddress === undefined) {
      //resetState();
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
  const newLionId = await jungletoken2.generateAnimal(walletAddress,true); //descrip
  console.log('new lion id!', newLionId);
  //const wait_for_lions = await jungletoken2.getAnimals(walletAddress,true);
  //setLions(wait_for_lions);
  //console.log('da jungle...',wait_for_lions);

}
const addPleb = async () => {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
    const jungletoken2 = new ethers.Contract(
        jungleTokenContractAddress.JungleToken,
        JungleTokenArtifact.abi,
        provider2.getSigner(0)
    );
  const newPlebId = await jungletoken2.generateAnimal(walletAddress,false); //descrip
  console.log('new pleb id!', newPlebId);
  const wait_for_plebs = await jungletoken2.getAnimals(walletAddress,false);
  //setPlebs(wait_for_plebs);
  //console.log('da plebs...',wait_for_plebs);
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
//something is wrong with state for lions and thing... its one behind

//need to make an animal token (and name lol) 

//food
//extendo 1 / 2
//display ASAP... and understood, since needed
//fr combat. hopefully contract too? nah..
// then can fix the backend a little bit (a little bit), payable

const Connected = () => {
  if (!lions || !plebs) {
    return(<Loading/>);
  }
  else {
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
}

const getAnimals = async () => {
    const provider2 = new ethers.providers.Web3Provider(window.ethereum);
  const jungletoken2 = new ethers.Contract(
        jungleTokenContractAddress.JungleToken,
        JungleTokenArtifact.abi,
        provider2.getSigner(0)
  );
  const wait_for_lions = await jungletoken2.getAnimals(walletAddress,true);
  setLions(wait_for_lions);
  const wait_for_plebs = await jungletoken2.getAnimals(walletAddress,false);
  setPlebs(wait_for_plebs);
}

useEffect(() => {
    if (walletAddress) {
      console.log('Fetching tweets...');
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