import { web3 } from './getWeb3';
import abi from 'ethereumjs-abi'

export const FACTORY_ADDRESS = "0xafe173e4e987ac5c5b1808d42d762a464bc580b7"

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

export const stringEncode = toEncode => {
  return `0x${abi.soliditySHA3(['string'], [toEncode]).toString('hex')}`
}