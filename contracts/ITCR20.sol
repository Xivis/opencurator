pragma solidity ^0.4.24;

import "./zeppelin/IERC20.sol";

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
    function updateStatus(bytes32 _listingHash) public;

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

