const EventContract = artifacts.require("EventContract");

module.exports = async function (deployer) {
    await deployer.deploy(EventContract);
};