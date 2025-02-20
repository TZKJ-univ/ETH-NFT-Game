const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["ZORO", "NAMI", "USOPP"], // キャラクターの名前
    [
      "https://i.imgur.com/TZEhCTX.png", // キャラクターの画像
      "https://i.imgur.com/WVAaMPA.png",
      "https://i.imgur.com/pCMZeiM.png",
    ],
    [100, 200, 300], // キャラクターのHP
    [100, 50, 25],
    "CROCODILE",
    "https://i.imgur.com/BehawOh.png",
    10000,
    50
  );

  const nftGame = await gameContract.deployed();
  console.log("Contract deployed to:", nftGame.address);
};
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();