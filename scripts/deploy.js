// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {


  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();
  console.log("Token address:", token.address);
  saveFrontendFilesToken(token);


  const JungleToken = await ethers.getContractFactory("JungleToken");
  const jungletoken = await JungleToken.deploy();
  await jungletoken.deployed();
  console.log("Jungle Token Address:", jungletoken.address);
  saveFrontendFilesJungleToken(jungletoken)

  // We also save the contract's artifacts and address in the frontend directory
}

function saveFrontendFilesToken(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/token-contract-address.json",
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    contractsDir + "/Token.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

function saveFrontendFilesJungleToken(jungletoken) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/jungletoken-contract-address.json",
    JSON.stringify({ JungleToken: jungletoken.address }, undefined, 2)
  );

  const JungleTokenArtifact = artifacts.readArtifactSync("JungleToken");

  fs.writeFileSync(
    contractsDir + "/JungleToken.json",
    JSON.stringify(JungleTokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
