// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventContract {
    struct Ticket {
        string name;
        uint256 price; // in Wei
        uint256 totalTickets;
        uint256 ticketsSold;
    }

    struct Event {
        address owner;
        string date;
        Ticket[] tiers;
        bool isActive;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    event EventCreated(uint256 indexed eventId, address indexed owner);
    event TicketPurchased(uint256 indexed eventId, uint256 tierIndex, uint256 quantity, address indexed buyer);

    modifier onlyOwner(uint256 eventId) {
        require(events[eventId].owner == msg.sender, "Only event owner can perform this action");
        _;
    }

    function createEvent(
        string memory _date,
        string[] memory _tierNames,
        uint256[] memory _prices,
        uint256[] memory _ticketCounts
    ) 
    public {
        require(_tierNames.length == _prices.length && _prices.length == _ticketCounts.length, "Tier data mismatch");

        Event storage newEvent = events[eventCount];
        newEvent.owner = msg.sender;
        newEvent.date = _date;
        newEvent.isActive = true;

        for (uint256 i = 0; i < _tierNames.length; i++) {
            newEvent.tiers.push(Ticket({
                name: _tierNames[i],
                price: _prices[i],
                totalTickets: _ticketCounts[i],
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
        uint256 _eventId, 
        uint256 _tierIndex, 
        uint256 _quantity
    ) 
    public payable {
        Event storage _event = events[_eventId];
        require(_event.isActive, "Event is not active");
        require(_tierIndex < _event.tiers.length, "Invalid tier index");

        Ticket storage tier = _event.tiers[_tierIndex];
        require(tier.ticketsSold + _quantity <= tier.totalTickets, "Not enough tickets available");
        require(msg.value == tier.price * _quantity, "Incorrect ETH sent");

        tier.ticketsSold += _quantity;

        emit TicketPurchased(_eventId, _tierIndex, _quantity, msg.sender);
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
