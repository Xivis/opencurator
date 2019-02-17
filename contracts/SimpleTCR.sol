pragma solidity ^0.4.24;

import "./zeppelin/ERC20Tradable.sol";
import "./ITCR20.sol";

/**
* @title Simple implementation of TCRs
* @author Team Xivis <xivis.com>
*/
contract SimpleTCR is ITCR20 {
    // -------
    // EVENTS:
    // -------

    event _Application(bytes32 indexed listingHash, uint deposit, uint appEndDate, string data, address indexed applicant);
    event _Challenge(bytes32 indexed listingHash, uint challengeID, string data, uint voteEndDate, address indexed challenger);
    event _Vote(uint indexed challengeID, uint numTokens, address indexed voter);
    event _VotingRightsGranted(uint numTokens, address indexed voter);
    event _VotingRightsWithdrawn(uint numTokens, address indexed voter);
    event _ChallengeResolved(bytes32 indexed listingHash, uint indexed challengeID, uint rewardPool, uint totalTokens, bool success);
    event _ApplicationWhitelisted(bytes32 indexed listingHash);
    event _ListingExited(bytes32 indexed listingHash);

    using SafeMath for uint;

    // Base registry variables
    string private _name;
    IERC20 private _token;
    string private _description;
    string private _acceptedDataType;
    string private _applyScheme;
    string private _voteScheme;
    string private _tokenScheme;
    string private _exitScheme;

    // Challenge basic variables
    uint constant public INITIAL_POLL_ID = 0;
    uint public pollID;

    struct Listing {
        uint applicationExpiry; // Expiration date of apply stage
        bool whitelisted;       // Indicates registry status
        address owner;          // Owner of Listing
        uint unstakedDeposit;   // Number of tokens in the listing not locked in a challenge
        uint challengeID;       // Corresponds to a PollID in PLCRVoting
        uint exitTime;          // Time the listing may leave the registry
        uint exitTimeExpiry;    // Expiration date of exit period
        string data;
    }

    struct Challenge {
        bytes32 listingHash;    // listing hash of the challenge
        address challenger;     // Owner of Challenge
        bool resolved;          // Indication of if challenge is resolved
        uint stake;             // Number of tokens at stake for either party during challenge
        uint totalTokens;       // (remaining) Number of tokens used in voting by the winning side
        uint rewardPool;        // (remaining) Pool of tokens to be distributed to winning voters
        uint voteEndDate;       /// expiration date of commit period for poll
        uint votesFor;          /// all token votes supporting proposal
        uint votesAgainst;      /// all token votes countering proposal
        mapping(address => bool) tokenClaims;   // Indicates whether a voter has claimed a reward yet
        mapping(address => uint) tokenStakes;   // Indicates the amount of tokens locked by a voter
        mapping(address => uint) votingOptions; // Indicates the amount of tokens locked by a voter
    }

    // Maps challengeIDs to associated challenge data
    mapping(uint => Challenge) public challenges;

    // Maps listingHashes to associated listingHash data
    mapping(bytes32 => Listing) public listings;

    // Maps parameters string hashes to values
    mapping(bytes32 => uint) public params;

    // Maps user's address to voteToken balance
    mapping(address => uint) public voteTokenBalance;

    /**
    * @dev Initializer. Can only be called once.
    * @param token The address where the ERC20 token contract is deployed
    */
    function init(string name, string description, string acceptedDataType, address token, uint[] parameters) public {
        require(token != 0 && address(_token) == 0);

        // Base registry parameters
        _name = name;
        _description = description;
        _acceptedDataType = acceptedDataType;
        _applyScheme = "SIMPLE";
        _voteScheme = "SIMPLE";
        _exitScheme = "SIMPLE";

        _tokenScheme = "ERC20";
        _token = ERC20Tradable(token);

        // required deposit for listing to be whitelisted. No more, no less.
        set("requiredDeposit", parameters[0]);

        // period over which applicants wait to be whitelisted
        set("applyStageLen", parameters[1]);

        // length of commit period for voting
        set("voteStageLen", parameters[2]);

        // percentage of losing party's deposit distributed to winning party
        set("dispensationPct", parameters[3]);

        // sets the initial pollID
        pollID = INITIAL_POLL_ID;
    }

    function name() public view returns (string){
        return _name;
    }

    function description() public view returns (string){
        return _description;
    }

    function acceptedDataType() public view returns (string){
        return _acceptedDataType;
    }

    function getParameter(string pName) public view returns (uint pValue) {
        return get(pName);
    }

    function applyScheme() public view returns (string){
        return _applyScheme;
    }

    function voteScheme() public view returns (string){
        return _voteScheme;
    }

    function tokenScheme() public view returns (string){
        return _tokenScheme;
    }

    function exitScheme() public view returns (string){
        return _exitScheme;
    }

    function token() public view returns (IERC20) {
        return _token;
    }

    // Main functions
    function apply(bytes32 _listingHash, uint _tokenAmount, string _data) external {
        require(!isWhitelisted(_listingHash));
        require(!appWasMade(_listingHash));
        require(_tokenAmount == get("requiredDeposit"));

        // Sets owner
        Listing storage listing = listings[_listingHash];
        listing.owner = msg.sender;
        listing.data = _data;

        // Sets apply stage end time
        listing.applicationExpiry = block.timestamp.add(get("applyStageLen"));
        listing.unstakedDeposit = _tokenAmount;

        // Transfers tokens from user to Registry contract
        require(_token.transferFrom(listing.owner, this, _tokenAmount));

        emit _Application(_listingHash, _tokenAmount, listing.applicationExpiry, _data, msg.sender);
    }

    function getListingData(bytes32 _listingHash) external view returns (string memory jsonData) {
        Listing memory listing = listings[_listingHash];
        // You can do some kind of data transformation here
        return listing.data;
    }

    /**
    * Determines whether the given listingHash be whitelisted.
    * @param _listingHash The listingHash whose status is to be examined
    */
    function canBeWhitelisted(bytes32 _listingHash) view public returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;
        // Ensures that the application was made,
        // the application period has ended,
        // the listingHash can be whitelisted,
        // and either: the challengeID == 0, or the challenge has been resolved.
        if (
            appWasMade(_listingHash) &&
            listings[_listingHash].applicationExpiry < now &&
            !isWhitelisted(_listingHash) &&
            (challengeID == 0 || challenges[challengeID].resolved == true)
        ) {return true;}

        return false;
    }

    /**
    * Add an already Applied listingHash to the whitelist
    * @dev Called by updateStatus() if the applicationExpiry date passed without a challenge being made.
    * @dev Called by resolveChallenge() if an application/listing beat a challenge.
    * @param _listingHash The listingHash of an application/listingHash to be whitelisted
    */
    function whitelistApplication(bytes32 _listingHash) private {
        if (!listings[_listingHash].whitelisted) {emit _ApplicationWhitelisted(_listingHash);}
        listings[_listingHash].whitelisted = true;
    }

    /**
    * Determines the winner in a challenge. Rewards the winner tokens and either whitelists
    * or de-whitelists (reset) the listingHash.
    * @param _listingHash A listingHash with a challenge that is to be resolved
    */
    function resolveChallenge(bytes32 _listingHash) private {
        uint challengeID = listings[_listingHash].challengeID;

        // Sets flag on challenge being processed
        challenges[challengeID].resolved = true;

        if (challengeSucceeded(challengeID)) {
            challenges[challengeID].totalTokens = challenges[challengeID].votesFor;
            whitelistApplication(_listingHash);
        } else {
            challenges[challengeID].totalTokens = challenges[challengeID].votesAgainst;
            resetListing(_listingHash);
        }
    }

    /**
     * Determines the number of tokens awarded to the winning party in a challenge.
     * @param _challengeID The challengeID to determine a reward for
     */
    function determineReward(uint _challengeID) public view returns (uint) {
        require(!challenges[_challengeID].resolved && challengeEnded(_challengeID));

        // Edge case, nobody voted, give all tokens to the challenger.
        if (challenges[_challengeID].votesFor.add(challenges[_challengeID].votesAgainst) == 0) {
            return 2 * challenges[_challengeID].stake;
        }

        return (2 * challenges[_challengeID].stake).sub(challenges[_challengeID].rewardPool);
    }

    /**
    * Updates a listingHash status from 'application' to 'listing' or resolves a challenge if one exists.
    * @param _listingHash The listingHash whose status is being updated
    */
    function updateStatus(bytes32 _listingHash) public {
        if (canBeWhitelisted(_listingHash)) {
            whitelistApplication(_listingHash);
        } else if (challengeCanBeResolved(_listingHash)) {
            resolveChallenge(_listingHash);
        } else {
            revert();
        }
    }

    /**
    * Starts a poll for a listingHash which is either in the apply stage or already in the whitelist.
    * @dev Tokens are taken from the challenger and the applicant's deposits are locked.
    * @param _listingHash The listingHash being challenged, whether listed or in application
    * @param _data Extra data relevant to the challenge. Think IPFS hashes.
    */
    function challenge(bytes32 _listingHash, uint _tokenAmount, string _data) external returns (uint challengeID) {
        uint requiredDeposit = get("requiredDeposit");

        // _tokenAmount must match the requiredDeposit
        require(requiredDeposit == _tokenAmount);

        Listing storage listing = listings[_listingHash];

        // Listing must be in apply stage or already on the whitelist
        require(appWasMade(_listingHash) || listing.whitelisted);
        // Prevent multiple challenges
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        // Sets pollID
        pollID = pollID + 1;

        // Defines voting commit duration
        uint voteEndDate = block.timestamp.add(get("voteStageLen"));

        uint oneHundred = 100;
        // Kludge that we need to use SafeMath
        challenges[pollID] = Challenge({
            listingHash : _listingHash,
            challenger : msg.sender,
            rewardPool : ((oneHundred.sub(get("dispensationPct"))).mul(requiredDeposit)).div(100),
            stake : get("requiredDeposit"),
            resolved : false,
            totalTokens : 0,
            voteEndDate : voteEndDate,
            votesFor : 0,
            votesAgainst : 0
            });

        // Updates listingHash to store most recent challenge
        listing.challengeID = pollID;

        // Locks tokens for listingHash during challenge
        listing.unstakedDeposit = listing.unstakedDeposit.sub(requiredDeposit);

        // Takes tokens from challenger
        require(_token.transferFrom(msg.sender, this, requiredDeposit));

        emit _Challenge(_listingHash, pollID, _data, voteEndDate, msg.sender);
        return pollID;
    }

    /**
    * Loads _tokenAmount ERC20 tokens into the voting contract for one-to-one voting rights
    * @dev Assumes that msg.sender has approved voting contract to spend on their behalf
    * @param _tokenAmount The number of votingTokens desired in exchange for ERC20 tokens
    */
    function requestVotingRights(uint _tokenAmount) public {
        require(_token.balanceOf(msg.sender) >= _tokenAmount);
        voteTokenBalance[msg.sender] = voteTokenBalance[msg.sender].add(_tokenAmount);
        require(_token.transferFrom(msg.sender, this, _tokenAmount));
        emit _VotingRightsGranted(_tokenAmount, msg.sender);
    }

    /**
    * Checks if an expiration date has been reached
    * @param _terminationDate Integer timestamp of date to compare current timestamp with
    * @return expired Boolean indication of whether the terminationDate has passed
    */
    function isExpired(uint _terminationDate) constant public returns (bool expired) {
        return (block.timestamp > _terminationDate);
    }

    /**
    * Checks if the vote period is still active for the specified poll
    * @dev Checks isExpired for the specified poll's voteEndDate
    * @param _challengeID Integer identifier associated with target poll
    * @return Boolean indication of isCommitPeriodActive for target poll
    */
    function votePeriodActive(uint _challengeID) constant public returns (bool active) {
        Challenge storage _challenge = challenges[_challengeID];
        require(challengeExists(_challenge.listingHash) > 0);
        return !isExpired(_challenge.voteEndDate);
    }

    /**
    * Commits vote using hash of choice and secret salt to conceal vote until reveal
    * @param _challengeID Integer identifier associated with target poll
    * @param _tokenAmount The number of tokens to be committed towards the target poll
    * @param _data Extra data relevant to the vote.
    */
    function vote(uint _challengeID, uint _tokenAmount, string _data) external {
        require(votePeriodActive(_challengeID));

        // try to convert _data string to a valid _voteOption
        uint _voteOption;
        if (keccak256(abi.encodePacked(_data)) == keccak256(abi.encodePacked("1"))) {
            _voteOption = 1;
        } else if (keccak256(abi.encodePacked(_data)) == keccak256(abi.encodePacked("0"))) {
            _voteOption = 0;
        } else {
            revert();
        }

        // get challenge 
        Challenge storage _challenge = challenges[_challengeID];

        // voter can't change his previous vote
        require(_challenge.tokenStakes[msg.sender] == 0);

        // prevent user from committing to zero node placeholder
        require(_challengeID != 0);

        // if msg.sender doesn't have enough voting rights,
        // request for enough voting rights
        if (voteTokenBalance[msg.sender] < _tokenAmount) {
            uint remainder = _tokenAmount.sub(voteTokenBalance[msg.sender]);
            requestVotingRights(remainder);
        }

        // make sure msg.sender has enough voting rights
        require(voteTokenBalance[msg.sender] >= _tokenAmount);

        // set voter's tokenStakes
        _challenge.tokenStakes[msg.sender] = _tokenAmount;

        // adds voter's stake to total amount of tokens staked in this challenge
        _challenge.stake = _tokenAmount.add(_challenge.stake);

        // apply numTokens to appropriate poll choice
        if (_voteOption == 1) {
            _challenge.votesFor = _challenge.votesFor.add(_tokenAmount);
        } else {
            _challenge.votesAgainst = _challenge.votesAgainst.add(_tokenAmount);
        }

        // store voter's selected option
        _challenge.votingOptions[msg.sender] = _voteOption;

        emit _Vote(_challengeID, _tokenAmount, msg.sender);
    }

    /**
    * Called by a applier or challenger to get their reward
    * @dev Someone must call updateStatus() before this can be called.
    * @param _challengeID The voting pollID of the challenge a reward is being claimed for
    */
    function claimChallengeReward(uint _challengeID) public {
        Challenge storage _challenge = challenges[_challengeID];
        require(!challenges[_challengeID].resolved);

        // calculates the winning choice
        uint winningChoice;
        if (_challenge.votesFor >= _challenge.votesAgainst) {
            winningChoice = 0;
        } else {
            winningChoice = 1;
        }

        uint reward = determineReward(_challengeID);

        Listing storage listing = listings[_challenge.listingHash];
        address owner = listing.owner;
        address challenger = _challenge.challenger;

        if (challengeSucceeded(_challengeID) && msg.sender == challenger) {
            // Send to challenger
            uint stake = _challenge.stake;

            // Unlock stake and return it to the applier
            listing.unstakedDeposit = listing.unstakedDeposit.add(stake);

            // Transfer the remaining reward to the challenger
            require(_token.transfer(owner, reward.sub(stake)));
        } else if (!challengeSucceeded(_challengeID) && msg.sender == owner) {
            // Transfer the reward to the challenger
            require(_token.transfer(challenger, reward));
        } else {
            revert();
        }
    }

    /**
    * Called by a voter to get their reward
    * @dev Someone must call updateStatus() before this can be called.
    * @param _challengeID The voting pollID of the challenge a reward is being claimed for
    */
    function claimVoterReward(uint _challengeID) public {
        Challenge storage _challenge = challenges[_challengeID];
        // Ensures the voter has not already claimed tokens and _challenge results have
        // been processed
        require(_challenge.tokenClaims[msg.sender] == false, "Reward already redeemed");
        require(_challenge.resolved == true, "Challenge must be resolved before trying to claim the reward");

        uint reward = voterReward(msg.sender, _challengeID);
        uint voterTokens = _challenge.tokenStakes[msg.sender];

        if (reward > 0) {
            // Subtracts the voter's information to preserve the participation ratios
            // of other voters compared to the remaining pool of rewards
            _challenge.totalTokens = _challenge.totalTokens.sub(voterTokens);
            _challenge.rewardPool = _challenge.totalTokens.sub(reward);

            // Ensures a voter cannot claim tokens again
            _challenge.tokenClaims[msg.sender] = true;

            require(_token.transfer(msg.sender, reward));
            // Reward + Unlock could be implemented in one single transfer
        }

        // Unlock staked tokens in the challenge
        if (voterTokens > 0) {
            voteTokenBalance[msg.sender] = voteTokenBalance[msg.sender].sub(voterTokens);
            require(_token.transfer(msg.sender, voterTokens));
        }
    }

    /**
    * Deletes a listingHash from the whitelist and transfers remaining tokens back to owner
    * @param _listingHash The listing hash to delete
    */
    function resetListing(bytes32 _listingHash) private {
        Listing storage listing = listings[_listingHash];

        // Deleting listing to prevent reentry
        address owner = listing.owner;
        uint unstakedDeposit = listing.unstakedDeposit;
        delete listings[_listingHash];

        // Transfers any remaining balance back to the owner
        if (unstakedDeposit > 0) {
            require(_token.transfer(owner, unstakedDeposit));
        }
    }

    /**
    * Inits the exit of the listing (deletes a listingHash and transfers remaining tokens back to owner)
    * @param _listingHash The listing hash to delete
    * @param _data Extra info added to this function
    */
    function exit(bytes32 _listingHash, string _data) external {
        Listing storage listing = listings[_listingHash];

        require(msg.sender == listing.owner);
        require(isWhitelisted(_listingHash));

        // Cannot exit during ongoing challenge
        require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

        resetListing(_listingHash);

        emit _ListingExited(_listingHash, 0, _data);
    }

    /**
    * Determines if a listingHash is whitelisted
    * @param _listingHash of an application
    */
    function isWhitelisted(bytes32 _listingHash) public view returns (bool whitelisted) {
        return listings[_listingHash].whitelisted;
    }

    /**
    * Determines if a challenge exists
    * @param _listingHash of an application
    * @return lastChallengeID indicating 0 if the challenge not exits or is not resolved
    */
    function challengeExists(bytes32 _listingHash) public view returns (uint lastChallengeID) {
        uint challengeID = listings[_listingHash].challengeID;

        if (challengeID == 0 || !challenges[challengeID].resolved) {
            return 0;
        }

        return challengeID;
    }

    /**
    * Determines if poll is over
    * @dev Checks isExpired for specified poll's revealEndDate
    * @return Boolean indication of whether polling period is over
    */
    function challengeEnded(uint _challengeID) constant public returns (bool ended) {
        // require(challengeExists(_challengeID) > 0);

        return isExpired(challenges[_challengeID].voteEndDate);
    }

    /**
    * Determines whether voting has concluded in a challenge for a given listingHash. Throws if no challenge exists.
    * @param _listingHash A listingHash with an unresolved challenge
    */
    function challengeCanBeResolved(bytes32 _listingHash) public view returns (bool) {
        uint challengeID = listings[_listingHash].challengeID;
        require(challengeExists(_listingHash) > 0);

        return challengeEnded(challengeID);
    }

    /**
    * Get the amount of tokens rewarded to be rewarded
    * @param _voter address of the voter
    * @param _challengeID ID of the challenge
    */
    function voterReward(address _voter, uint _challengeID) public view returns (uint tokenAmount) {
        Challenge storage _challenge = challenges[_challengeID];
        // Ensures the voter has not already claimed tokens and _challenge results have been processed
        require(_challenge.tokenClaims[_voter] == false, "Reward already redeemed");
        require(_challenge.resolved == true, "Challenge must be resolved before trying to claim the reward");

        // calculates the winning choice
        uint winningChoice = 1;
        if (challengeSucceeded(_challengeID)) {
            winningChoice = 0;
        }

        // voter's tokens staked at this challenge 
        uint _voterOption = _challenge.votingOptions[_voter];
        if (_voterOption == winningChoice) {
            uint voterTokens = _challenge.tokenStakes[_voter];
            return voterTokens.mul(_challenge.rewardPool).div(_challenge.totalTokens);
        } else {
            return 0;
        }
    }

    /**
    * Get the amount of tokens rewarded to the challenger
    * @param _applierOrChallenger address of the challenger
    * @param _challengeID ID of the challenge
    */
    function challengeReward(address _applierOrChallenger, uint _challengeID) public view returns (uint tokenAmount) {
        Challenge storage _challenge = challenges[_challengeID];
        require(_challenge.resolved == true, "Challenge must be resolved before trying to claim the reward");

        uint reward = determineReward(_challengeID);
        address applier = listings[_challenge.listingHash].owner;
        address challenger = _challenge.challenger;

        if(challengeSucceeded(_challengeID) && _applierOrChallenger == challenger){
            return reward;
        } else if (!challengeSucceeded(_challengeID) && _applierOrChallenger == applier){
            return reward;
        }

        return 0;
    }

    /**
    * Determines if challenge has challengeSucceeded
    * @dev Check if votesFor won
    * @param _challengeID Integer identifier associated with listing challenge
    */
    function challengeSucceeded(uint _challengeID) constant public returns (bool succeeded) {
        Challenge storage _challenge = challenges[_challengeID];
        require(_challenge.resolved == true, "Challenge must be resolved before trying to claim the reward");
        return _challenge.votesFor >= _challenge.votesAgainst;
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
    * @param pName The key whose value is to be determined
    * @return value The value of the parameter
    */
    function get(string pName) public view returns (uint value) {
        return params[keccak256(abi.encodePacked(pName))];
    }

    /**
    * Sets the param keyed by the provided name to the provided value
    * @param pName The name of the param to be set
    * @param value The value to set the param to be set
    */
    function set(string pName, uint value) private {
        params[keccak256(abi.encodePacked(pName))] = value;
    }
}