const CONTRACT_ACCOUNT = "0x25ed58c027921E14D86380eA2646E3a1B5C55A8b";
const CONTRACT_START = 13153967;
const INFURA_KEY = "263a394bc14c4107949a73b0fb485ebb";
const fs = require('fs')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + INFURA_KEY))
const erc721 = require("@0xcert/ethereum-erc721/build/erc721.json").ERC721
const contract = new web3.eth.Contract(erc721.abi, CONTRACT_ACCOUNT)

let idToNumber = {}

contract.getPastEvents('Transfer', { fromBlock: CONTRACT_START }).then(events => {
  events.forEach(event => {
    /* if the user does not yet have one token, add one */
    if (!idToNumber[event.returnValues._to]) {
      idToNumber[event.returnValues._to] = 1
    } else {
      /* if they already have one, add another one */
      idToNumber[event.returnValues._to] = idToNumber[event.returnValues._to] + 1
    }
    if (idToNumber[event.returnValues._from]) {
      /* if the user is sending a token to someone else, remove the token from their count */
      idToNumber[event.returnValues._from] = idToNumber[event.returnValues._from] - 1
    }
  });

  const filteredArr = []

  Object.entries(idToNumber).map(item => {
    if (item[1] !== Number()) {
      filteredArr.push(item[0])
    }
  })

  console.log('filteredArr: ', filteredArr.length)

  fs.writeFileSync('./snapshot.json', JSON.stringify(filteredArr))
});