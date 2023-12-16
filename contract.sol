// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import necessary libraries
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Contract definition
contract MasterPlanner is Ownable(msg.sender), ERC721("EventNFT", "EVTNFT") {
    using SafeMath for uint256;

    // Enums for ticket types
    enum TicketType { Economy, Business, FirstClass }

    // Structs for meal options, airline tickets, and event tickets
    struct MealOptions {
        bool vegetarian;
        bool otherSpecialNeeds;
    }

    struct AirlineTicket {
        TicketType ticketType;
        MealOptions mealOptions;
    }

    struct EventTicket {
        bool isVIP;
        bool isGroup;
    }

    // Struct for refund policy
    struct RefundPolicy {
        bool isRefundable;
        uint256 organizerCancellationFee;
        uint256 buyerCancellationFee;
    }

    // Struct for organization details
    struct Organization {
        string name;
        string logoURI; // URI for the organization's logo
        string bannerURI; // URI for the banner (e.g., IPFS hash or URL)
        string url; // Organization's URL
        string additionalInfo; // Additional information provided by the organization
    }

    // Event structure
    struct Event {
        string name;
        address organizer;
        address payable wallet;
        string advertisement;
        uint256 ticketPrice;
        uint256 ticketSupply;
        uint256 ticketsSold;
        RefundPolicy refundPolicy;
        mapping(address => uint256) ticketsPurchased;
        mapping(uint256 => Ticket) ticketsForSale;
        uint256 totalRevenue;
        uint256 totalRatings;
        uint256 numRatings;
    }

    // Ticket structure for resale
    struct Ticket {
        address payable seller;
        uint256 price;
        bool isAvailable;
        AirlineTicket airlineTicket;
        EventTicket eventTicket;
    }

    // Mapping to store events by their unique IDs
    mapping(uint256 => Event) events;

    // Mapping to indicate supported coins
    mapping(address => bool) supportedCoins;

    // Mapping to track NFT ownership by user
    mapping(address => uint256) userNFT;

    // Mapping to store organization details
    mapping(address => Organization) organizations;

    // Event counter
    uint256  eventCount;

    // Counter for NFT token IDs
    uint256  nftTokenIdCounter;

    // Public getter function for supportedCoins
    function isCoinSupported(address coin) public view returns (bool) {
        return supportedCoins[coin];
    }

    // Event fired when a new event is created
    event EventCreated(uint256 indexed eventId, string name, address organizer, address wallet, string advertisement, uint256 ticketPrice, uint256 ticketSupply);

    // Event fired when a ticket is purchased
    event TicketPurchased(uint256 indexed eventId, address buyer, uint256 amount, AirlineTicket airlineTicket, EventTicket eventTicket);

    // Event fired when a ticket is put up for sale
    event TicketForSale(uint256 indexed eventId, uint256 indexed ticketId, address seller, uint256 price);

    // Event fired when a resale ticket is purchased
    event ResaleTicketPurchased(uint256 indexed eventId, uint256 indexed ticketId, address buyer, uint256 amount);

    // Event fired when an event is canceled by the organizer
    event EventCanceled(uint256 indexed eventId);

    // Event fired when an event is rated
    event EventRated(uint256 indexed eventId, address indexed rater, uint256 rating);

    // Event fired when an NFT is minted as proof of purchase
    event NFTMinted(address indexed owner, uint256 indexed eventId, uint256 tokenId);

    // Event fired when organization details are updated
    event OrganizationDetailsUpdated(address indexed organizer, string name, string logoURI, string bannerURI, string url, string additionalInfo);

    // Function to create a new event
    function createEvent(
        string memory _name,
        address payable _wallet,
        string memory _advertisement,
        uint256 _ticketPrice,
        uint256 _ticketSupply,
        bool _isRefundable,
        uint256 _organizerCancellationFee,
        uint256 _buyerCancellationFee
    ) external onlyWhitelistedOrganizer {
        require(_ticketPrice > 0, "Invalid ticket price");
        require(_ticketSupply > 0, "Invalid ticket supply");

        uint256 eventId = eventCount++;
        Event storage newEvent = events[eventId];

        // Assign values to the struct
        newEvent.name = _name;
        newEvent.organizer = msg.sender;
        newEvent.wallet = _wallet;
        newEvent.advertisement = _advertisement;
        newEvent.ticketPrice = _ticketPrice;
        newEvent.ticketSupply = _ticketSupply;
        newEvent.ticketsSold = 0;

        // Set refund policy
        newEvent.refundPolicy = RefundPolicy({
            isRefundable: _isRefundable,
            organizerCancellationFee: _organizerCancellationFee,
            buyerCancellationFee: _buyerCancellationFee
        });

        // Event fired when a new event is created
        emit EventCreated(eventId, _name, msg.sender, _wallet, _advertisement, _ticketPrice, _ticketSupply);
    }

    // Function to purchase a ticket
    function purchaseTicket(
        uint256 _eventId,
        bool _isVIP,
        bool _isGroup,
        bool _vegetarian,
        bool _otherSpecialNeeds
    ) external payable {
        Event storage selectedEvent = events[_eventId];
        require(selectedEvent.organizer != address(0), "Event does not exist");
        require(msg.value >= selectedEvent.ticketPrice, "Insufficient funds");
        require(selectedEvent.ticketsSold < selectedEvent.ticketSupply, "Sold out");

        // Transfer funds to the event wallet
        selectedEvent.wallet.transfer(msg.value);

        // Update ticket information
        selectedEvent.ticketsSold++;
        selectedEvent.ticketsPurchased[msg.sender]++;

        // Create an airline ticket with meal options
        AirlineTicket memory airlineTicket = AirlineTicket({
            ticketType: TicketType.Economy, // Default to Economy class
            mealOptions: MealOptions({
                vegetarian: _vegetarian,
                otherSpecialNeeds: _otherSpecialNeeds
            })
        });

        // Create an event ticket with VIP and Group options
        EventTicket memory eventTicket = EventTicket({
            isVIP: _isVIP,
            isGroup: _isGroup
        });

        // Mint NFT as proof of purchase
        mintNFT(msg.sender, _eventId);

        // Event fired when a ticket is purchased
        emit TicketPurchased(_eventId, msg.sender, selectedEvent.ticketPrice, airlineTicket, eventTicket);
    }

    // Function to resell a ticket
    function resellTicket(uint256 _eventId, uint256 _ticketId, uint256 _price) external {
        Event storage selectedEvent = events[_eventId];
        require(selectedEvent.organizer != address(0), "Event does not exist");
        require(selectedEvent.ticketsPurchased[msg.sender] > 0, "You haven't purchased a ticket");
        require(selectedEvent.ticketsForSale[_ticketId].isAvailable == false, "Ticket is already for sale");

        // Set ticket for resale
        selectedEvent.ticketsForSale[_ticketId] = Ticket({
            seller: payable(msg.sender),
            price: _price,
            isAvailable: true,
            airlineTicket: AirlineTicket({
                ticketType: TicketType.Economy,
                mealOptions: MealOptions({
                    vegetarian: false,
                    otherSpecialNeeds: false
                })
            }),
            eventTicket: EventTicket({
                isVIP: false,
                isGroup: false
            })
        });

        // Event fired when a ticket is put up for sale
        emit TicketForSale(_eventId, _ticketId, msg.sender, _price);
    }

    // Function to buy a resale ticket
    function buyResaleTicket(uint256 _eventId, uint256 _ticketId) external payable {
        Event storage selectedEvent = events[_eventId];
        Ticket storage ticketForSale = selectedEvent.ticketsForSale[_ticketId];
        require(ticketForSale.isAvailable, "Ticket is not available for resale");
        require(msg.value >= ticketForSale.price, "Insufficient funds");

        // Transfer funds to the seller
        ticketForSale.seller.transfer(msg.value);

        // Mark the ticket as sold
        ticketForSale.isAvailable = false;

        // Update ticket information
        selectedEvent.ticketsSold++;
        selectedEvent.ticketsPurchased[msg.sender]++;

        // Mint NFT for the buyer as proof of purchase
        mintNFT(msg.sender, _eventId);

        // Event fired when a resale ticket is purchased
        emit ResaleTicketPurchased(_eventId, _ticketId, msg.sender, msg.value);
    }

    // Function for event organizer to cancel an event
    function cancelEvent(uint256 _eventId) external onlyWhitelistedOrganizer {
        Event storage canceledEvent = events[_eventId];
        require(canceledEvent.organizer != address(0), "Event does not exist");

        // Refund all ticket holders
        for (uint256 i = 0; i < canceledEvent.ticketsSold; i++) {
            address ticketHolder = getKeyByIndex(canceledEvent.ticketsPurchased, i);
            uint256 ticketPrice = canceledEvent.ticketPrice;

            // Calculate refund amount based on the organizer's cancellation fee
            if (canceledEvent.refundPolicy.isRefundable) {
                uint256 refundAmount = calculateRefund(ticketPrice, canceledEvent.refundPolicy.buyerCancellationFee);
                payable(ticketHolder).transfer(refundAmount);
            }
        }

        // Reset event details
        canceledEvent.ticketsSold = 0;
        canceledEvent.totalRevenue = 0;

        // Event fired when an event is canceled by the organizer
        emit EventCanceled(_eventId);
    }

    // Function to rate an event
    function rateEvent(uint256 _eventId, uint256 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Invalid rating");
        Event storage ratedEvent = events[_eventId];
        require(ratedEvent.organizer != address(0), "Event does not exist");

        // Update event ratings
        ratedEvent.totalRatings = ratedEvent.totalRatings.add(_rating);
        ratedEvent.numRatings++;

        // Event fired when an event is rated
        emit EventRated(_eventId, msg.sender, _rating);
    }

    // Function to mint an NFT as proof of purchase
    function mintNFT(address _owner, uint256 _eventId) internal {
        uint256 tokenId = nftTokenIdCounter++;
        _mint(_owner, tokenId);
        userNFT[_owner] = tokenId;

        // Event fired when an NFT is minted as proof of purchase
        emit NFTMinted(_owner, _eventId, tokenId);
    }

    // Function to set organization details, including banner
    function setOrganizationDetails(string memory _name, string memory _logoURI, string memory _bannerURI, string memory _url, string memory _additionalInfo) external {
        organizations[msg.sender] = Organization({
            name: _name,
            logoURI: _logoURI,
            bannerURI: _bannerURI,
            url: _url,
            additionalInfo: _additionalInfo
        });

        // Event fired when organization details are updated
        emit OrganizationDetailsUpdated(msg.sender, _name, _logoURI, _bannerURI, _url, _additionalInfo);
    }

    // Modifier to restrict access to whitelisted organizers
   modifier onlyWhitelistedOrganizer() {
    require(bytes(organizations[msg.sender].name).length > 0, "Address not whitelisted as organizer");
    _;
}


    // Function to get a key from a mapping by index
    function getKeyByIndex(mapping(address => uint256) storage map, uint256 index) internal view returns (address) {
        require(index < eventCount, "Index out of bounds");

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < eventCount; i++) {
            address key = getKeyAtIndex(map, i);
            if (map[key] != 0) {
                if (currentIndex == index) {
                    return key;
                }
                currentIndex++;
            }
        }

        revert("Index not found");
    }

    // Function to get a key from a mapping at a specific index
    function getKeyAtIndex(mapping(address => uint256) storage map, uint256 index) internal view returns (address) {
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < eventCount; i++) {
            address key = getAddressAtIndex(map, i);
            if (map[key] != 0) {
                if (currentIndex == index) {
                    return key;
                }
                currentIndex++;
            }
        }

        revert("Index not found");
    }

    // Function to get an address from a mapping at a specific index
    function getAddressAtIndex(mapping(address => uint256) storage map, uint256 index) internal view returns (address) {
        require(index < eventCount, "Index out of bounds");
        address[] memory keys = new address[](eventCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < eventCount; i++) {
            address key = getAddressAtIndex(map, i);
            keys[i] = key;
        }
        return keys[index];
    }

    // Function to calculate refund amount
    function calculateRefund(uint256 _amount, uint256 _cancellationFee) internal pure returns (uint256) {
        require(_cancellationFee <= 100, "Invalid cancellation fee");

        // Calculate refund amount after deducting the cancellation fee
        uint256 refundAmount = _amount * (100 - _cancellationFee) / 100;
        return refundAmount;
    }
}
