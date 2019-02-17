---
eip: <to be assigned>
title: Token Curated Registry Standard
author: Xivis Team <info@xivis.com>, Martin Sanchez <marto@xivis.com>, Agustin Ferreira <agustin@xivis.com>, Ramiro Gonzales <ramiro@xivis.com>, Agustin Lavarello <alavarello@xivis.com>
discussions-to: <URL>
status: Draft
type: Standards Track
category: ERC
created: 2019-02-17
requires: EIP-20
---

## Simple Summary
A standard interface for Token Curated Registries (aka TCRs).

## Abstract
The following standard describes the implementation of a Token Curated Registry interface (using the widely used ERC20 token standard) allowing for easy to use systems and platforms to be developed. 

The interface is kept simple but general enough to allow various use cases to be implemented (from the common ones to the ones more complex).

Some examples could be: TCRs with a Bonded Curved Token, TCRs with a Commit/Reveal voting system, TCRs with pre selected Tokens Holders, ordered TCRs, TCRs of TRCs among others.

This standard describes the minimal and common functionality such as Apply, Challenge, Vote and Claim Rewards to a TCR (of any shape and form).

## Motivation
As the Ethereum community moves more and more towards token models, having a Token Curated Registry standard, which is common to users and developers it's primordial and the logical step forward to develop strong decentralized curation applications.

This common interface can be used by a variety of applications to tackle some or many important aspects of Token Curated Registries.

Maybe the focus could be on the curation aspect, and an app can show all TCRs created with the standard and give the users the same interface to "curate" all, no mather the particulars implementation of each one of them.

Or maybe the focus could be on the trading and economical aspect, and an app could give the user the possibility to bid, but or sell some curated assets like from a TCR of "Most valuable NFTs".

And this, are only some examples, the uses can be more.


## The Token Curated Registry Reading List

- Mike Golding - Github repo (https://github.com/skmgoldin/tcr)

- Mike Golding - Token Curated Registry 1.0 Whitepaper (https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7)

- Mike Golding - Token-Curated Registries 1.1 (https://medium.com/@ilovebagels/token-curated-registries-1-1-2-0-tcrs-new-theory-and-dev-updates-34c9f079f33d)

- Simon de la Rouviere - Continuous Token-Curated Registries: The Infinity of Lists (https://medium.com/@simondlr/continuous-token-curated-registries-the-infinity-of-lists-69024c9eb70d)

## Specification

``` solidity
interface ITCR20 {
    function name() public view returns(string);
    function description() public view returns(string);
    
    function acceptedDataType() public view returns(string);
    function applyScheme() public view returns(string);
    function voteScheme() public view returns(string);
    function exitScheme() public view returns(string);
    function tokenScheme() public view returns(string);
    function token() public view returns(IERC20);

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external;
    function getListingData(bytes32 _listingHash) external view returns (string memory jsonData);
    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID);
    function vote(uint _challengeID, uint _tokenAmount, string _data) external;
    function claimChallengeReward(uint _challengeID) public;
    function claimVoterReward(uint _challengeID) public;
    function exit(bytes32 _listingHash, string _data) external;

    // Getters and Helpers functions
    function getParameter(string pName) public view returns (uint pValue);

    function isWhitelisted(bytes32 _listingHash) public view returns (bool whitelisted);
    function challengeExists(bytes32 _listingHash) public view returns (uint lastChallengeID);
    function challengeCanBeResolved(bytes32 _listingHash) public view returns (bool need);
    function voterReward(address _voter, uint _challengeID) public view returns (uint tokenAmount);
    function challengeReward(address _applierOrChallenger, uint _challengeID) public view returns (uint tokenAmount);

    // Events
    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, address indexed applier, string data);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, uint voteEndDate, address indexed challenger, string data);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter, string _data);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash, uint voteEndDate, string data);
}
```

## Rationale

The variables and functions detailed below MUST be implemented.

**`name` function**
``` solidity
 function name() public view returns(string);
```
Returns the name of the Token Curated Registry, e.g., `"Decentraland Robots"`, `"TCR Party"` or `"Adchain"`.


**`description` function**
``` solidity
 function description() public view returns(string);
```
Returns a brief description of the expected listings or the intended curation of the Registry, e.g., `"A list of curated Robots avatars to be used as a whitelist in any Land in Decentraland proyect"`.


**`acceptedDataType` function**
``` solidity
 function acceptedDataType() public view returns(string);
```
Returns the valid type of listing that the registry accepts in the `apply` function.
It's strongly recommended that in any implementation this accepted type is validated in the `apply` function.
An example could be one of the followings: `"ERC721"`, `"ERC20"`, `"SHA3-STRING"`, etc.
 This function could allow any Dapp, to validate the data to be send in the `apply` function and also help to improve in a IX/UX aspect.


**`voteScheme` function**
``` solidity
 function applyScheme() public view returns(string)
```
Returns the implemented apply scheme. This generalization allow many types of apply schemas to be implemented using the same standard interface.
An example of some vote schemes could be one of the followings: 

`"SIMPLE"`: This type of scheme the TCR expose `requiredDeposit` as a parameter which it's the exact amount of tokens that the `apply` function requires.
 Also, can be consulted in any time using the `getParameter` function.

`"OPEN"`: This type of scheme allows any token amount to be staked in the listing. 

Other schemas could be added in the future.


**`voteScheme` function**
``` solidity
 function voteScheme() public view returns(string)
```
Returns the implemented voting scheme. This generalization allow many types of voting schemas to be implemented following the same standard.
An example of some vote schemes could be one of the followings: 

`"SIMPLE"`: This is the simplest schema, just a counter for votes to "Keep" or "Kick" the challenged listing. After the challenge period ends, the side with the most amount of votes registeres will "Keep" or "Kick" the listing from the registry.

`"DELEGATE"`: More details about the use cases and common implementation of this schema here (https://solidity.readthedocs.io/en/v0.5.4/solidity-by-example.html#voting)

`"COMMIT-REVEAL"`: More details about the use cases and common implementation of this schema here (https://medium.com/gitcoin/commit-reveal-scheme-on-ethereum-25d1d1a25428).

Other schemas could be added in the future by anyone.


**`exitScheme` function**
``` solidity
 function exitScheme() public view returns(string)
```
Returns the implemented exit scheme. This generalization allow many types of exit schemas to be implemented following the same standard.
An example of some vote schemes could be one of the followings: 

`"SIMPLE"`: This is the simplest schema. The listing is removed some the TCR at the instant that the listing owner wants to withdraw the locked stake.

`"DELAYED"`: This is a common use case. This type of scheme the TCR expose `exitPeriod` as a parameter which it's the exact amount of time that a listing is have to wait before the owner can withdraw the locked stake and the listing is removed from the TCR.
 Also, can be consulted in any time using the `getParameter` function.

Other schemas could be added in the future by anyone.


**`tokenScheme` function**
``` solidity
 function tokenScheme() public view returns(string)
```
Returns the used any known token implementation. This generalization allow many types of voting schemas to be implemented following the same standard.
An example of some vote schemes could be one of the followings: `"ERC20Detailed"`, `"ERC20Mintable"`, `"ERC20Burnable"`.

The intended use of this function is provide a way from where, any Dapp can query the implemented 
TCR if some special Token implementation was use and user this information to show or hide special functionality.

For example, if the application get a `"ERC20Mintable"` as return maybe it's can enable a MINT button for the owner to use the `mint` function of that specific.

Another example would be that the TCR implementation use a `"ERC20Tradable"` (aka ERC20 with Buy and Sell functions), if so, it can allow any application add a BUY and SELL options to all users.


This next functions are a generalization to the Mike Golding paper about TCRs (https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7). We strongly recommend to read it before continue.

**`token` function**
``` solidity
  function token() public view returns(IERC20)
```
Returns the IERC20 token address of the used token of the TCR.


**`apply` function**
``` solidity
 function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external
```
The `apply` function takes three arguments:
* A listing hash: a 32-byte hash of the listing’s identifier.
* The number of tokens to deposit. In the case of `SIMPLE` applyScheme, must be equal to TRC’s `requiredDeposit`.
* An arbitrary data string which can be used to point to additional information about the proposed listing.

When making an application, the user first needs to approve the registry contract to transfer tokens on their behalf greater than or equal to the `_tokenAmount` argument they intend to specify.

This standard *uses [listing hashes](#listing-hash) to support arbitrary listing types. 

There are many ways to use the [data](#data) string, but the "correct" usage for a particular TCR should be established [by convention](#convention-also-by-convention). Without a conventional usage standard, applicants will struggle to understand how to provide sufficient information to token-holders in their applications, and client software may fail to properly parse the provided data.

###### Events emitted by an application
An `_Application` event is emitted if the application is successful:
``` solidity
  event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, address indexed applier, string data)
```


**`getListingData` function**
``` solidity
 function getListingData(bytes32 _listingHash) external view returns (string memory jsonData)
```
this function only takes one argument: 
* A listing hash: a 32-byte hash of the listing’s identifier.

The intended user of this function is to give a way to the TCR owner to control de way in which the particular listing is displayed to the user.

The suggested format of the this function return 
```json
{
    "name": "Asset Name",
    "assets": [
      "Asset URL 1",
      "Asset URL 2"  
    ],
    "description": "Asset description"
}
```

**`challenge` function**
``` solidity
 function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID)
```
The `challenge` function takes three arguments:
* A listing hash: a 32-byte hash of the listing’s identifier.
* The number of tokens to challenge the applier stake. In the case of `SIMPLE` applyScheme, must be equal to TRC’s `requiredDeposit`.
* An arbitrary data string which can be used by the different schemas.

###### Events emitted by a challenge
An `_Challenge` event is emitted if the challenge is successful:
``` solidity
  event _Challenge(bytes32 indexed listingHash, uint challengeID, uint voteEndDate, address indexed challenger, string data)
```

**`vote` function**
``` solidity
  function vote(uint _challengeID, uint _tokenAmount, string _data) external;
```
* A challenge ID: an incremental uint assigned to the challenge when was successfully created.
* The number of tokens to support the sender vote option.
* An arbitrary data string which has different usages depending on the voteScheme: 

`SIMPLE`: _data must be the chose vote option (Keep = "0" or Kick = "1").

`COMMIT-REVEAL`: _data must be a CSV depending on the "vote phase" witch should be the first value (Commit phase = 0 or Reveal phase = 1).
An example of the next comma separated values of an implementation could be found here (https://github.com/skmgoldin/tcr/blob/master/owners_manual.md#voting-in-a-challenge)


###### Events emitted by a vote
An `_Vote` event is emitted if the challenge is successful:
``` solidity
  event _Vote(uint indexed challengeID, uint numTokens, address indexed voter, string _data);
```

**`claimChallengeReward` function**
``` solidity
  function claimChallengeReward(uint _challengeID) public
```
* A challenge ID: an incremental uint assigned to the challenge when was successfully created.

Gives the Challenger or the Applier the reward of a ended created challenge.

**`claimVoterReward` function**
``` solidity
  function claimVoterReward(uint _challengeID) public
```
* A challenge ID: an incremental uint assigned to the challenge when was successfully created.

Gives the Voters reward of a ended created challenge to the sender.


**`exit` function**
``` solidity
  function exit(bytes32 _listingHash, string _data) external; 
```
The `exit` function takes three arguments:
* A listing hash: a 32-byte hash of the listing’s identifier.
* An arbitrary data string which can be used by the different schemas.
In the case of `SIMPLE` exitSchema, no extra _data is needed, and the stake will be returned to the applier at the moment of calling the function.

###### Events emitted by a exit
An `_ListingExited` event is emitted if the exit is successful:
``` solidity
  event _ListingExited(bytes32 indexed listingHash, uint voteEndDate, string data)
```


**`updateStatus` function**
``` solidity
  function updateStatus(bytes32 _listingHash) public
```
This function have 2 main functions:
* Poke the application into the registry only if no challenge was made and can be whitelisted.
* Resolve an already existing challenge made to an application or already whitelisted listing.

###### Events emitted by a updateStatus
An `__ApplicationWhitelisted` event is emitted if the application is successfully:
``` solidity
  event _ApplicationWhitelisted(bytes32 indexed listingHash);
```
An `_ChallengeResolved` event is emitted if the challenge is resolved:
``` solidity
  event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success)
```


**`getParameter` function**
``` solidity
    function getParameter(string pName) public view returns (uint pValue)
```
Return any parameter needed by any particular scheme.


###### The next getters and helpers functions should be auto explanatory

**`isWhitelisted` function**
``` solidity
  function isWhitelisted(bytes32 _listingHash) public view returns (bool whitelisted)
```
Return if the _listingHash is already whitelisted.

**`challengeExists` function**
``` solidity
  function challengeExists(bytes32 _listingHash) public view returns (uint lastChallengeID)
```
Return if the _listingHash is already whitelisted.

**`challengeCanBeResolved` function**
``` solidity
  function challengeCanBeResolved(bytes32 _listingHash) public view returns (bool need)
```
Return if the _listingHash "need" and update to be resolve.

**`voterReward` function**
``` solidity
  function voterReward(address _voter, uint _challengeID) public view returns (uint tokenAmount)
```
Return the amount of token won by a _voter for a specific challenge.

**`voterReward` function**
``` solidity
  function challengeReward(address _applierOrChallenger, uint _challengeID) public view returns (uint tokenAmount)
```  
Return the amount of token won by a Challenger or Applier for a specific challenge.


## Test Cases
Open Curator - https://github.com/Xivis/opencurator


## Implementation
Open Curator -  SimpleTCR (https://github.com/Xivis/opencurator/blob/master/contracts/SimpleTCR.sol)


## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
