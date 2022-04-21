require("dotenv").config();
const API_URL = process.env.API_URL; // Alchemy Robsten URL
const PUBLIC_KEY = process.env.PUBLIC_KEY; // Metamask public address
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Metamask Private Key 


const {createAlchemyWeb3} = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const contractAddress = "";
const nftContarct = new web3.eth.Contract(contract.abi,contractAddress);

async function mintNFT(tokenURI){
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY,"latest");
    const tx = {
        'from':PUBLIC_KEY,
        'to':contractAddress,
        'nonce':nonce,
        'gas':500000,
        'data':nftContarct.methods.mintNFT(PUBLIC_KEY,tokenURI).encodeABI(),
    };

    const signPromise = web3.eth.accounts.signTransaction(tx,PRIVATE_KEY);
    signPromise.then((signedTx)=>{
        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function(err,hash){
                if(!err){
                    console.log("The hash of your transaction is: ",hash,"\n Check Alchemy's Mempool to view the status of the transaction");
                }else{
                    console.log("Something Went Wrong when submitting transaction: ",err);
                }
            }
        );
    }).catch((err)=>{
        console.log("Promise Failed: ",err);
    });

}

mintNFT(""); // Enter your nft-metadata.json file url from Pinata


