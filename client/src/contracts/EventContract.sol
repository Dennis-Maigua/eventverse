// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventContract {
    struct Event {
        address admin;
        string name;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketRemaining;
        bool isCancelled;
    }

    mapping(uint => Event) public events;
    mapping(address => mapping(uint => uint)) public tickets;
    uint public nextId;

    // Event for logging ticket purchases
    event TicketsPurchased(uint eventId, address buyer, uint quantity);

    // Event for logging ticket transfers
    event TicketsTransferred(uint eventId, address from, address to, uint quantity);

    // Event for logging new event creation
    event EventCreated(uint eventId, address admin, string name, uint date, uint ticketCount);

    // Event for logging event cancellation
    event EventCancelled(uint eventId);

    // Function to create a new event
    function createEvent(
        string calldata name,
        uint date,
        uint price,
        uint ticketCount
    ) external {
        require(date > block.timestamp, "Can only organize event at a future date");
        require(ticketCount > 0, "Can only organize event with at least 1 ticket");
        events[nextId] = Event(
            msg.sender, 
            name, 
            date, 
            price, 
            ticketCount,
            ticketCount,
            false
        );
        emit EventCreated(nextId, msg.sender, name, date, ticketCount);
        nextId++;
    }

    // Function to buy tickets for an event
    function buyTicket(uint id, uint quantity) 
        eventExist(id) 
        eventActive(id)
        payable 
        external 
    {
        Event storage _event = events[id];
        require(!_event.isCancelled, "Event is cancelled");
        require(msg.value == (_event.price * quantity), "Ether sent must equal total ticket cost");
        require(_event.ticketRemaining >= quantity, "Not enough tickets left");
        _event.ticketRemaining -= quantity;
        tickets[msg.sender][id] += quantity;
        emit TicketsPurchased(id, msg.sender, quantity);
    }

    // Function to transfer tickets
    function transferTicket(uint eventId, uint quantity, address to) 
        eventExist(eventId) 
        eventActive(eventId) 
        external 
    {
        require(tickets[msg.sender][eventId] >= quantity, "Not enough tickets");
        tickets[msg.sender][eventId] -= quantity;
        tickets[to][eventId] += quantity;
        emit TicketsTransferred(eventId, msg.sender, to, quantity);
    }

    // Function for event admin to cancel an event
    function cancelEvent(uint id) external eventExist(id) {
        Event storage _event = events[id];
        require(msg.sender == _event.admin, "Only admin can cancel the event");
        require(!_event.isCancelled, "Event already cancelled");
        _event.isCancelled = true;
        emit EventCancelled(id);
    }

    // Function for event admin to withdraw funds
    function withdrawFunds(uint id) external eventExist(id) {
        Event storage _event = events[id];
        require(msg.sender == _event.admin, "Only admin can withdraw funds");
        require(block.timestamp > _event.date, "Event must be concluded");
        require(!_event.isCancelled, "Cannot withdraw funds for cancelled events");
        uint balance = address(this).balance;
        payable(_event.admin).transfer(balance);
    }

    // Modifier to check if event exists
    modifier eventExist(uint id) {
        require(events[id].date != 0, "This event does not exist");
        _;
    }

    // Modifier to check if event is active
    modifier eventActive(uint id) {
        require(block.timestamp < events[id].date, "Event must be active");
        _;
    }
}
