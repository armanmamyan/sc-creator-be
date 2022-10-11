const ethers = require('hardhat');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

// node deployer.js --folderName=MutantSerum

async function deploy() {
    const HelloWorld = await ethers.getContractFactory(argv.fileName);

    // Start deployment, returning a promise that resolves to a contract object
    const hello_world = await HelloWorld.deploy("Hello World!");   
    console.log("Contract deployed to address:", hello_world.address);
}

if(!argv?.fileName) {
    deploy()
      .then(() => process.exit(0))
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
}

