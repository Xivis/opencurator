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

## Specification

``` solidity
interface ITCR20 {

    function name() public view returns(string);
    function description() public view returns(string);

    function acceptedDataType() public view returns(string);
    function voteScheme() public view returns(string);
    function tokenScheme() public view returns(string);
    function exitScheme() public view returns(string);

    function token() public view returns(IERC20);

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external;
    function getListingData(bytes32 _listingHash) external view returns (string memory jsonData);
    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID);
    function vote(uint _challengeID, uint _tokenAmount, uint[] _data) external;
    function claimChallengeReward(uint _challengeID) public;
    function claimVoterReward(uint _challengeID) public;
    function exit(bytes32 _listingHash, string _data) external;

    // Helpers/optional functions
    function isWhitelisted(bytes32 _listingHash) public view returns (bool whitelisted);
    function challengeExists(bytes32 _listingHash) public view returns (uint lastChallengeID);
    function challengeCanBeResolved(bytes32 _listingHash) public view returns (bool need);
    function voterReward(address _voter, uint _challengeID) public view returns (uint tokenAmount);
    function challengeReward(address _applierOrChallenger, uint _challengeID) public view returns (uint tokenAmount);

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate,
     address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);
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


**`acceptedDataTypes` function**
``` solidity
 function acceptedDataType() public view returns(string);
```
An array of supported type of listtings that the registry accepts as a valid listing. It's strongly recommended that in any implementation, this Accepted Types are validated in the ´apply´ function.
An example could be one of the followings: `"ERC721"`, `"ERC20"`, `"SHA3-STRING"`, etc.
This function could allow any Dapp, to validate the data to be send in the `apply` function to be explained in the following lines.


**`voteScheme` function**
``` solidity
 function voteScheme() public view returns(string)
```
Returns an string of the implemented voting scheme. This generalization allow many types of voting schemas to be implemented following the same standard.
An example of some vote schemes could be one of the followings: 

`"SIMPLE"`: This is the simplest schema, just a counter for votes to "Keep" or "Kick" the challenged listing. After the challenge period ends, the side with the most amount of votes registeres will "Keep" or "Kick" the listing from the registry.

`"DELEGATE"`: More details about the use cases and common implementation of this schema here (https://solidity.readthedocs.io/en/v0.5.4/solidity-by-example.html#voting)

`"COMMIT-REVEAL"`: More details about the use cases and common implementation of this schema here (https://medium.com/gitcoin/commit-reveal-scheme-on-ethereum-25d1d1a25428).

Other schemas could be added in the future.


**`tokenScheme` function**
``` solidity
 function tokenScheme() public view returns(string)
```

-TODO ACA DEJE 16/2-



## Test Cases
<small>TODO Put here some links to general TCR test cases</small>

## Implementation
<small>TODO Put here link to the REPO of the interface implementation and examples</small>

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
