import { expect } from "chai";
const Web3 = require("web3");
// const alchemyProvider2 = new ethers.providers.JsonRpcProvider("https://eth-mainnet.alchemyapi.io/v2/0W2NJ1r0oDN9K_LVR_IwdXVXwirWBjcj");

export async function getAllAddressByTokenID(
  provider: string,
  EOA: string,
  CA: string) {
  const web3 = new Web3(provider);

  // address of ERC721 NFT
  // const nftAddress = "0x06012c8cf97bead5deae237070f9587f8e7a266d";
  const nftAddress = CA;

  // ERC721 abi to interact with contract
  const nftAbi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  // interact with contract
  const nftContract = new web3.eth.Contract(nftAbi, nftAddress);

  let arr: any[] = [];

  for (var i = 0; i < 2; i++) {
    // generate call data to get owner of token #i
    arr.push({
      target: nftAddress,
      callData: nftContract.methods["ownerOf"](i).encodeABI(),
    })
  }
  console.log(arr);

  // ----------------------------------------------------------------------------------
  // multicall
  // ----------------------------------------------------------------------------------

  // address of multicall contract for ETH mainnet
  const multicallAddress = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441";
  // multicall abi to interact with contract
  const multicallAbi = [
    {
      constant: false,
      inputs: [
        {
          components: [
            { name: "target", type: "address" },
            { name: "callData", type: "bytes" },
          ],
          name: "calls",
          type: "tuple[]",
        },
      ],
      name: "aggregate",
      outputs: [
        { name: "blockNumber", type: "uint256" },
        { name: "returnData", type: "bytes[]" },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // interact with multicall contract
  const multicallContract = new web3.eth.Contract(
    multicallAbi,
    multicallAddress
  );

  // provide args to multicall contract.
  // this will allow multicall to know who and what to call
  const multicallArgs = arr;

  // call multicall. The multicallArgs will call the NFT contract
  // and return the ownersOf token id 1,2,3
  const ownersOf = await multicallContract.methods["aggregate"](
    multicallArgs
  ).call();``
  console.log(ownersOf);

}