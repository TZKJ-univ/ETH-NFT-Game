import React, { useEffect, useState } from "react";
import LoadingIndicator from "../LoadingIndicator";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";

const SelectCharacter = ({ setCharacterNFT }) => {
    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);
    const [mintingCharacter, setMintingCharacter] = useState(false);

    const mintCharacterNFTAction = (characterId) => async () => {
        try {
            if (gameContract) {
                setMintingCharacter(true);
                console.log("Mining character NFT...");
                const mintTxn = await gameContract.mintCharacterNFT(characterId);
                await mintTxn.wait();
                console.log("Minted NFT successfully!");
                setMintingCharacter(false);
            }
        } catch (error) {
            console.warn("Mint character NFT failed!");
            setMintingCharacter(false);
        }
    };

    useEffect(() => {
    const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );
            setGameContract(gameContract);
        } else {
            console.log("Ethereum object doesn't exist!");
        }
    }, []);
    useEffect(() => {
        const getCharacters = async () => {
            try {
                console.log("Getting contract characters to mint");
                const charactersTxn = await gameContract.getAllDefaultCharacters();

                console.log("charactersTxn:", charactersTxn);

                const characters = charactersTxn.map((characterData) =>
                    transformCharacterData(characterData)
                );

                setCharacters(characters);
            } catch (error) {
                console.error("Something went wrong fetching characters:", error);
            }
        };

        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log(
                `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
            );
            if (gameContract) {
                const characterNFT = await gameContract.checkIfUserHasNFT();
                console.log("CharacterNFT:", characterNFT);
                setCharacterNFT(transformCharacterData(characterNFT));
                alert(
                    `NFT キャラクターが Mint されました -- リンクはこちらです: https://gemcase.versel.app/view/evm/sepolia/${gameContract.address}/${tokenId.toNumber()}`
                );
            }
        };
        if (gameContract) {
            getCharacters();
            gameContract.on("CharacterNFTMinted", onCharacterMint);
        }

        return () => {
            if (gameContract) {
                gameContract.off("CharacterNFTMinted", onCharacterMint);
            }
        };
    }, [gameContract]);
    const renderCharacters = () =>
        characters.map((character, index) => (
            <div className="character-item" key={index}>
                <div className="name-container">
                    <p>{character.name}</p>
                </div>
                <img src={character.imageURI} alt={character.name} />
                <button
                    type="button"
                    className="character-mint-button"
                    onClick={mintCharacterNFTAction(index)}
                >{`Mint ${character.name}`}</button>
            </div>
        ));
  return (
    <div className="select-character-container">
      <h2>⏬ 一緒に戦う NFT キャラクターを選択 ⏬</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className="loading">
            <div className="indicator">
                <LoadingIndicator />
                <p>Minting In Progress...</p>
            </div>
        </div>
        )}
    </div>
  );
};
export default SelectCharacter;