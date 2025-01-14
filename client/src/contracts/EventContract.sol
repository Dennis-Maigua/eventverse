// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventContract {
    struct Event {
        address owner;
        string posterUrl;
        string name;
        uint256 date;
        Venue venue;
        Ticket[] tiers;
        bool isActive;
        uint256 revenue;
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
    event EventCanceled(uint256 indexed eventId, address indexed owner);
    event FundsWithdrawn(uint256 indexed eventId, address indexed owner, uint256 amount);

    modifier onlyOwner(uint256 eventId) {
        require(events[eventId].owner == msg.sender, "Only event owner can perform this action");
        _;
    }

    function createEvent(
        string memory _posterUrl,
        string memory _name,
        uint256 _date,
        string memory _venueName,
        string memory _latitude,
        string memory _longitude,
        string[] memory _tierNames,
        uint256[] memory _tierPrices,
        uint256[] memory _tierTicketsCounts
    ) 
    public {
        require(_tierNames.length == _tierPrices.length && _tierPrices.length == _tierTicketsCounts.length, "Tier data mismatch");
        require(_date > block.timestamp, "Event date must be in the future");

        Event storage newEvent = events[eventCount];
        newEvent.owner = msg.sender;
        newEvent.posterUrl = _posterUrl;
        newEvent.name = _name;
        newEvent.date = _date; // Store as UNIX timestamp
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
    public view returns (
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
        uint256 _eventId, 
        uint256[] memory _tierIndexes, 
        uint256[] memory _addedQuantities
    ) 
    public payable {
        Event storage _event = events[_eventId];
        require(_event.isActive, "Event is not active");
        require(_tierIndexes.length == _addedQuantities.length, "Mismatch in tiers and quantities");

        uint256 totalCost = 0;

        for (uint256 i = 0; i < _tierIndexes.length; i++) {
            uint256 _tierIndex = _tierIndexes[i];
            uint256 _quantity = _addedQuantities[i];

            Ticket storage ticket = _event.tiers[_tierIndex];
            require(ticket.ticketsSold + _quantity <= ticket.totalTickets, "Not enough tickets available");
            
            totalCost += ticket.price * _quantity;
            ticket.ticketsSold += _quantity;
        }

        require(msg.value >= totalCost, "Insufficient payment");

        _event.revenue += totalCost;
        
        emit TicketPurchased(_eventId, _tierIndexes, _addedQuantities, msg.sender);
    }

    function cancelEvent(uint256 _eventId) 
    public onlyOwner(_eventId) {
        Event storage _event = events[_eventId];
        require(_event.revenue == 0, "Cannot cancel event after ticket sales");
        require(_event.isActive, "Event is already canceled");

        _event.isActive = false;

        emit EventCanceled(_eventId, msg.sender);
    }

    function withdrawFunds(uint256 _eventId) 
    public onlyOwner(_eventId) {
        Event storage _event = events[_eventId];
        require(!_event.isActive, "Cannot withdraw funds from an active event");
        require(block.timestamp >= _event.date, "Can only withdraw funds after the event date");
        require(_event.revenue > 0, "No funds to withdraw");

        uint256 balance = _event.revenue;
        _event.revenue = 0;

        payable(msg.sender).transfer(balance);

        emit FundsWithdrawn(_eventId, msg.sender, balance);
    }
}
