pragma solidity ^0.4.24;

import "./ITCR20.sol";
import "./zeppelin/ERC20.sol";
import "./zeppelin/SafeMath.sol";

contract SimpleTCR is ITCR20 {
    // -------
    // EVENTS:
    // -------

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint commitEndDate, uint revealEndDate,
    address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);

    using SafeMath for uint;

    // Base registry parameters
    string private _name;
    IERC20 private _token;
    string private _description;
    string private _acceptedDataType;
    string private _voteScheme;
    string private _tokenScheme;
    string private _exitScheme;

    // TCR basic parameters
    uint private _minDeposit;
    uint private _applyStageLen;
    uint private _commitStageLen;
    uint private _revealStageLen;
    uint private _dispensationPct;
    uint private _voteQuorum;
    uint private _exitTimeDelay;
    uint private _exitPeriodLen;

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

    /**
     * @dev Initializer. Can only be called once.
     * @param token The address where the ERC20 token contract is deployed
     */
    constructor(string name, string description, string acceptedDataType, address token, uint[] parameters) {
        require(token != 0 && address(token) == 0);
        
        // Base registry parameters
        _name = name;
        _description = description;
        _voteScheme = "Simple";
        _tokenScheme = "ERC20";
        _exitScheme = "Simple";
        _acceptedDataType = acceptedDataType;

        // required deposit for listing to be whitelisted. No more, no less.
        set("requiredDeposit", parameters[0]);

        // period over which applicants wait to be whitelisted
        set("applyStageLen", parameters[1]);

        // length of commit period for voting
        set("commitStageLen", parameters[2]);

        // length of reveal period for voting
        set("revealStageLen", parameters[3]);

        // percentage of losing party's deposit distributed to winning party
        set("dispensationPct", parameters[4]);

        // type of majority out of 100 necessary for candidate success
        set("voteQuorum", parameters[5]);

        // minimum length of time user has to wait to exit the registry
        set("exitTimeDelay", parameters[6]);

        // maximum length of time user can wait to exit the registry
        set("exitPeriodLen", parameters[7]);
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

    function getParameter(string pName) public view returns (uint pValue) {
        return get(pName);
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
        require(_token.transferFrom(listing.owner, this, _tokenAmount));

        emit _Application(_listingHash, _tokenAmount, listing.applicationExpiry, _data, msg.sender);
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



    /**
     * Returns true if apply was called for this listingHash
     * @param _listingHash The listingHash whose status is to be examined
     */
    function appWasMade(bytes32 _listingHash) view public returns (bool exists) {
        return listings[_listingHash].applicationExpiry > 0;
    }


    /**
     * Gets the parameter keyed by the provided name value from the params mapping
     * @param name The key whose value is to be determined
     * @return name The key whose value is to be determined
     */
    function get(string name) public view returns (uint value) {
        return params[keccak256(abi.encodePacked(name))];
    }

    /**
     * Sets the param keyed by the provided name to the provided value
     * @param name The name of the param to be set
     * @param value The value to set the param to be set
     */
    function set(string name, uint value) private {
        params[keccak256(abi.encodePacked(name))] = value;
    }
}