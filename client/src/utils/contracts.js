import { web3 } from './getWeb3';

export const FACTORY_ADDRESS = "0xa5020472a7d50125f1b8af553e4175fa8dda648a"

const signaturesITCR20 = [
  'name()',
  'description()',
  'acceptedDataType()',
  'voteScheme()',
  'tokenScheme()',
  'token()',
  'isWhitelisted(bytes32)',

  // TODO - for production check all methods signatures
]

export const contractHasMethods = async (contractAddress) => {
  const code = await web3.eth.getCode(contractAddress);
  for (let signature of signaturesITCR20){
    const hash = web3.eth.abi.encodeFunctionSignature(signature);
    if(code.indexOf(hash.slice(2, hash.length)) === -1){
      // console.log('Failed signature: ', signature)
      // return false
    }
  }
  return true
}