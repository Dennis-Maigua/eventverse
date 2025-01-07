// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventContract {
    struct TicketTier {
        string name;
        uint price; // Price in wei
        uint ticketCount;
        uint ticketRemaining;
    }

    struct Event {
        address owner;
        string name;
        string category;
        string description;
        string venue;
        uint date; // Unix timestamp
        TicketTier[] tiers;
        bool exists;
    }

    mapping(uint => Event) public events;
    uint public eventCount;

    event EventCreated(uint eventId, address owner);
    event TicketsPurchased(uint eventId, address buyer, uint tierIndex, uint quantity);

    function createEvent(
        string memory name,
        string memory category,
        string memory description,
        string memory venue,
        uint date,
        TicketTier[] memory ticketTiers
    ) public {
        require(date > block.timestamp, "Event date must be in the future");
        require(ticketTiers.length > 0, "At least one ticket tier is required");

        Event storage newEvent = events[eventCount];
        newEvent.owner = msg.sender;
        newEvent.name = name;
        newEvent.category = category;
        newEvent.description = description;
        newEvent.venue = venue;
        newEvent.date = date;
        newEvent.exists = true;

        for (uint i = 0; i < ticketTiers.length; i++) {
            newEvent.tiers.push(ticketTiers[i]);
        }

        emit EventCreated(eventCount, msg.sender);
        eventCount++;
    }

    function buyTickets(uint eventId, uint tierIndex, uint quantity) public payable {
        Event storage eventDetail = events[eventId];
        require(eventDetail.exists, "Event does not exist");
        require(eventDetail.date > block.timestamp, "Event has already occurred");

        TicketTier storage tier = eventDetail.tiers[tierIndex];
        require(quantity > 0, "Quantity must be greater than zero");
        require(tier.ticketRemaining >= quantity, "Not enough tickets available");
        require(msg.value == tier.price * quantity, "Incorrect ETH amount sent");

        tier.ticketRemaining -= quantity;

        emit TicketsPurchased(eventId, msg.sender, tierIndex, quantity);
    }
}