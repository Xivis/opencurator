pragma solidity ^0.4.24;

import "./zeppelin/IERC20.sol";

interface TCR20 {
    string public name;
    string public description;

    string[] public acceptedDataTypes;
    string public voteScheme;
    string public tokenScheme;
    string public exitScheme;

    IERC20 public token;

    struct Listing {}
    struct Challenge {}

    mapping(bytes32 => Listing) public listings;
    mapping(uint => Challenge) public challenges;

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external;
    function getListingData(bytes32 _listingHash) extrrnal returns (string jsonData);
    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID);
    function vote(bytes32 _challengeID, uint _tokenAmount, string[] _data) external;
    function claimChallengeReward(uint _challengeID) public;
    function claimVoterReward(uint _challengeID) public;
    function exit(bytes32 _listingHash, string _data) external;

    // Helpers/optional functions
    function isWhitelisted(bytes32 _listingHash) view public returns (bool whitelisted);
    function challengeExists(bytes32 _listingHash) view public returns (uint lastChallengeID);
    function challengeCanBeResolved(bytes32 _listingHash) view public returns (bool need);
    function voterReward(address _voter, uint _challengeID) public view returns (uint tokenAmount);
    function challengeReward(address _applierOrChallenger, uint _challengeID) public view returns (uint tokenAmount);

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);
}
