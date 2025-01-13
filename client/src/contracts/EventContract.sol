// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventContract {
    struct Event {
        address owner;
        string posterUrl;
        string name;
        string date;
        Venue venue;
        Ticket[] tiers;
        bool isActive;
    }

    struct Venue {
        string name;
        string latitude;
        string longitude;
    }

    struct Ticket {
        string name;
        uint256 price; // in Wei
        uint256 totalTickets;
        uint256 ticketsSold;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    event EventCreated(uint256 indexed eventId, address indexed owner);
    event TicketPurchased(uint256 indexed eventId, uint256[] tierIndexes, uint256[] quantities, address indexed buyer);

    modifier onlyOwner(uint256 eventId) {
        require(events[eventId].owner == msg.sender, "Only event owner can perform this action");
        _;
    }

    function createEvent(
        string memory _posterUrl,
        string memory _name,
        string memory _date,
        string memory _venueName,
        string memory _latitude,
        string memory _longitude,
        string[] memory _tierNames,
        uint256[] memory _tierPrices,
        uint256[] memory _tierTicketsCounts
    ) 
    public {
        require(_tierNames.length == _tierPrices.length && _tierPrices.length == _tierTicketsCounts.length, "Tier data mismatch");

        Event storage newEvent = events[eventCount];
        newEvent.owner = msg.sender;
        newEvent.posterUrl = _posterUrl;
        newEvent.name = _name;
        newEvent.date = _date;
        newEvent.venue = Venue(_venueName, _latitude, _longitude);
        newEvent.isActive = true;

        for (uint256 i = 0; i < _tierNames.length; i++) {
            newEvent.tiers.push(Ticket({
                name: _tierNames[i],
                price: _tierPrices[i],
                totalTickets: _tierTicketsCounts[i],
                ticketsSold: 0
            }));
        }

        emit EventCreated(eventCount, msg.sender);
        eventCount++;
    }

    function getEventTiers(uint256 _eventId) 
    public 
    view 
    returns (
        string[] memory names,
        uint256[] memory prices,
        uint256[] memory totalTickets,
        uint256[] memory ticketsSold
    ) {
        Event storage _event = events[_eventId];
        uint256 tierCount = _event.tiers.length;

        names = new string[](tierCount);
        prices = new uint256[](tierCount);
        totalTickets = new uint256[](tierCount);
        ticketsSold = new uint256[](tierCount);

        for (uint256 i = 0; i < tierCount; i++) {
            names[i] = _event.tiers[i].name;
            prices[i] = _event.tiers[i].price;
            totalTickets[i] = _event.tiers[i].totalTickets;
            ticketsSold[i] = _event.tiers[i].ticketsSold;
        }

        return (names, prices, totalTickets, ticketsSold);
    }

    function buyTickets(
        uint256 eventId, 
        uint256[] memory tierIndexes, 
        uint256[] memory quantities
    ) 
    public 
    payable 
    {
        Event storage _event = events[eventId];
        require(_event.isActive, "Event is not active");
        require(tierIndexes.length == quantities.length, "Mismatch in tiers and quantities");

        uint256 totalCost = 0;

        for (uint256 i = 0; i < tierIndexes.length; i++) {
            uint256 tierIndex = tierIndexes[i];
            uint256 quantity = quantities[i];
            Ticket storage ticket = _event.tiers[tierIndex];

            require(ticket.ticketsSold + quantity <= ticket.totalTickets, "Not enough tickets available");
            totalCost += ticket.price * quantity;
            ticket.ticketsSold += quantity;
        }

        require(msg.value >= totalCost, "Insufficient payment");

        // Emit the event with arrays of tier indexes and quantities
        emit TicketPurchased(eventId, tierIndexes, quantities, msg.sender);
    }

    function deactivateEvent(uint256 _eventId) 
    public onlyOwner(_eventId) {
        events[_eventId].isActive = false;
    }

    function withdrawFunds(uint eventId) 
    public onlyOwner(eventId) {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
