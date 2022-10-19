import { ethers } from 'ethers'

export async function countHoldingNFTs(
    provider: ethers.providers.WebSocketProvider,
    EOA: string,
    CA: string
): Promise<number> {
    const abi = [
        "function balanceOf(address owner) view returns (uint256)",
    ];
    const contract = new ethers.Contract(CA, abi, provider);
    let res = await contract.balanceOf(EOA);

    return res.toNumber();
}

export async function getAllAddressByTokenID(
    provider: ethers.providers.WebSocketProvider,
    EOA: string,
    CA: string) {
    const owner = new ethers.Wallet('4dfc9e11b48940aef89baf6a525fa7840caffd1cd3a2ccf6ec0cff78f8898ebe', provider)
    const abi = [
        // "function balanceOf(address owner) view returns (uint256)",
        "function ownerOf(uint256 tokenId) view returns (address owner)",
        // "function totalSupply() external view returns (uint256)"
    ];


    let iface = new ethers.utils.Interface(abi);

    const nftContract = new ethers.Contract(CA, abi, owner);
  
    let arr: any[] = [];

    for (var i = 0; i < 2; i++) {
        // generate call data to get owner of token #i
        arr.push({
            target: CA,
            callData: iface.encodeFunctionData("ownerOf", [i]),
        })
    }


    // ----------------------------------------------------------------------------------
    // multicall
    // ----------------------------------------------------------------------------------

    // address of multicall contract for ETH mainnet
    const multicallAddress = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441";
    // multicall abi to interact with contract
    const multicallAbi = JSON.stringify([
        {
            "constant": false,
            "inputs": [
              {
                "components": [
                  { "name": "target", "type": "address" },
                  { "name": "callData", "type": "bytes" }
                ],
                "name": "calls",
                "type": "tuple[]"
              }
            ],
            "name": "aggregate",
            "outputs": [
              { "name": "blockNumber", "type": "uint256" },
              { "name": "returnData", "type": "bytes[]" }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]);
    
    const multicallContract = new ethers.Contract(multicallAddress, multicallAbi, provider);
    const multicallArgs = arr;

    const _ownersOf = await multicallContract.connect(owner).aggregate(multicallArgs, {gasLimit: 250000});
    console.log(_ownersOf);

};