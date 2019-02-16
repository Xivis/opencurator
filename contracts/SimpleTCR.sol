pragma solidity ^0.4.24;

import "./ITCR20.sol";
import "./zeppelin/ERC20.sol";

contract SimpleTCR is ITCR20 {
    // -------
    // EVENTS:
    // -------

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate, address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);

    string private _name;
    string private _description;
    string private _acceptedDataType;
    string private _voteScheme;
    string private _tokenScheme;
    string private _exitScheme;
    IERC20 private _token;

    struct Listing {
        uint applicationExpiry; // Expiration date of apply stage
        bool whitelisted;       // Indicates registry status
        address owner;          // Owner of Listing
        uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge
        uint challengeID;       // Corresponds to a PollID in PLCRVoting
        uint exitTime;          // Time the listing may leave the registry
        uint exitTimeExpiry;    // Expiration date of exit period
    }

    struct Challenge {
        uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
        address challenger;     // Owner of Challenge
        bool resolved;          // Indication of if challenge is resolved
        uint stake;             // Number of tokens at stake for either party during challenge
        uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
        mapping(address => bool) tokenClaims; // Indicates whether a voter has claimed a reward yet
    }

    // Maps challengeIDs to associated challenge data
    mapping(uint => Challenge) public challenges;

    // Maps listingHashes to associated listingHash data
    mapping(bytes32 => Listing) public listings;

    // Maps parameters string hashes to values
    mapping(bytes32 => uint) public params;


    constructor(string name, string description) {
        _name = name;
        _description = description;
        _voteScheme = "Simple";
        _tokenScheme = "ERC20";
        _exitScheme = "Simple";
        _token = new ERC20();
    }

    function name() public view returns(string){
        return _name;
    }

    function description() public view returns(string){
        return _description;
    }

    function acceptedDataType() public view returns(string){
        return _acceptedDataType;
    }

    function voteScheme() public view returns(string){
        return _voteScheme;
    }

    function tokenScheme() public view returns(string){
        return _tokenScheme;
    }

    function exitScheme() public view returns(string){
        return _exitScheme;
    }

    function token() public view returns(IERC20) {
        return _token;
    }

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external {
        require(!isWhitelisted(_listingHash));
        require(!appWasMade(_listingHash));
        require(_tokenAmount >= get("minDeposit"));

        // Sets owner
        Listing storage listing = listings[_listingHash];
        listing.owner = msg.sender;

        // Sets apply stage end time
        listing.applicationExpiry = block.timestamp.add(get("applyStageLen"));
        listing.unstakedDeposit = _tokenAmount;

        // Transfers tokens from user to Registry contract
        require(token.transferFrom(listing.owner, this, _tokenAmount));

        emit _Application(_listingHash, _amount, listing.applicationExpiry, _data, msg.sender);
    }

    function getListingData(bytes32 _listingHash) external view returns (string memory jsonData) {
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