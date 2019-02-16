pragma solidity ^0.4.24;

import "./zeppelin/IERC20.sol";

contract TCR20 {
    string public name;
    string public description;

    string[] public acceptedDataTypes;
    string public voteScheme;
    string public tokenScheme;
    string public exitScheme;

    IERC20 public token;

    struct Listing {
        bool whitelisted;
    }
    struct Challenge {
        bool resolved;
    }

    mapping(bytes32 => Listing) public listings;
    mapping(uint => Challenge) public challenges;

    // Main functions
    function submit(bytes32 _listingHash, uint _tokenAmount, string _data) external;
    function getListingData(bytes32 _listingHash) public returns (string memory jsonData);
    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID);
    function vote(uint _challengeID, uint _tokenAmount, uint[] _data) external;
    function claimChallengeReward(uint _challengeID) external;
    function claimVoterReward(uint _challengeID) external;
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
