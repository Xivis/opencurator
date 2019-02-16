pragma solidity ^0.4.24;

import "./ITCR20.sol";
import "./zeppelin/ERC20.sol";

contract SimpleTCR is ITCR20 {
    string private _name;
    string private _description;
    string private _acceptedDataType;
    string private _voteScheme;
    string private _tokenScheme;
    string private _exitScheme;
    IERC20 private _token;

    // Events
    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);

    constructor(string name, string description) {
        _name = name;
        _description = description;
        _voteScheme = "Simple";
        _tokenScheme = "ERC20";
        _exitScheme = "Simple";
        _token = new ERC20();
    }

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external {
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

    function claimChallengeReward(uint _challengeID) public {}

    function claimVoterReward(uint _challengeID) public {}

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