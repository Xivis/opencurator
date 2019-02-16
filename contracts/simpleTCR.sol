pragma solidity ^0.4.24;

import "./TCR20.sol";
import "./zeppelin/ERC20.sol";

contract simpleTCR is TCR20 {
    string public name = "Awesome Cryptokitties";
    string public description = "Really awesome Cryptokitties";

    string[] public acceptedDataTypes = ["ERC721"];
    string public voteScheme = "Simple";
    string public tokenScheme = "Mintable";
    string public exitScheme = "Simple";

    IERC20 public token = new ERC20();

    // Events
    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate,
    address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);

    function init(address _token, address _voting, uint[] memory _parameters, string memory _name) public {
        // TODO
    }

    // Main functions
    function submit(bytes32 _listingHash, uint _tokenAmount, string _data) external {
        emit _Application(_listingHash, 100, 180000, "{'name':'Shoshannah','URI':'https://www.cryptokitties.co/kitty/927111'}", parseAddr("0xD4b5dA5E7090749Fe7597EDC63c4145dd04C7340"));
    }

    function getListingData(bytes32 _listingHash) public returns (string memory jsonData) {
        return "{'id': 1, 'name': 'name'}";
    }

    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID) {
        emit _Challenge(_listingHash, 1, _data, 2000000, 2500000, parseAddr("0xEa6a814D3E6E40186B68a63C98bcd37167B0027E"));
        return 1;
    }

    function vote(uint _challengeID, uint _tokenAmount, uint[] _data) external {
        emit _Vote(1, 200, parseAddr("0xAE67a98301c3F3e5229ea391240078e7d5F7051E"));
    }

    function claimChallengeReward(uint _challengeID) external {}

    function claimVoterReward(uint _challengeID) external {}

    function exit(bytes32 _listingHash, string _data) external {
        emit _ListingExited(_listingHash);
    }

    // Helpers/optional functions
    function isWhitelisted(bytes32 _listingHash) public view returns (bool whitelisted) {
        return true;
    }
    function challengeExists(bytes32 _listingHash) public view returns (uint lastChallengeID) {
        return 0; 
    }
    function challengeCanBeResolved(bytes32 _listingHash) public view returns (bool need) {
        return true;
    } 
    function voterReward(address _voter, uint _challengeID) public view returns (uint tokenAmount) {
        return 100;
    }
    function challengeReward(address _applierOrChallenger, uint _challengeID) public view returns (uint tokenAmount) {
        return 300;
    }
    function parseAddr(string _a) internal returns (address);
}