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

    function name() public returns(string){
        return _name;
    }

    function description() public returns(string){
        return _description;
    }

    function acceptedDataType() public returns(string){
        return _acceptedDataType;
    }

    function voteScheme() public returns(string){
        return _voteScheme;
    }

    function tokenScheme() public returns(string){
        return _tokenScheme;
    }

    function exitScheme() public returns(string){
        return _exitScheme;
    }

    function token() public returns(IERC20) {
        return _token;
    }

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external {
        emit _Application(_listingHash, 100, 180000, "{'name':'Shoshannah','URI':'https://www.cryptokitties.co/kitty/927111'}", address(this));
    }

    function getListingData(bytes32 _listingHash) public returns (string memory jsonData) {
        return "{'id': 1, 'name': 'name'}";
    }

    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID) {
        emit _Challenge(_listingHash, 1, _data, 2000000, 2500000, address(this));
        return 1;
    }

    function vote(uint _challengeID, uint _tokenAmount, uint[] _data) external {
        emit _Vote(1, 200, address(this));
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
}