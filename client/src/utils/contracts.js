import { web3 } from './getWeb3';

const RINKEBY_ADDRESS = '0x6c85cfa7140395a880613eb0ef208cb6565584b3'

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
      console.log('Failed signature: ', signature)
      return false
    }
  }
  return true
}