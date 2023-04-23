const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const wallet = new ethers.Wallet(
    "0x5b3208286264f409e1873e3709d3138acf47f6cc733e74a6b47a040b50472fd8",
    provider
  );
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait...");
  const contract = await contractFactory.deploy(); //STOP, wait for contract to deploy
  await contract.deploymentTransaction().wait(1);

  const currentFavouriteNumber = await contract.retrieve();
  console.log(`Current favourite number: ${currentFavouriteNumber.toString()}`);

  const transactionResponse = await contract.store("8");
  const transactionReceipt = await transactionResponse.wait(1);
  const updatedFavouriteNumber = await contract.retrieve();

  console.log(`Updated favourite number is: ${updatedFavouriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
