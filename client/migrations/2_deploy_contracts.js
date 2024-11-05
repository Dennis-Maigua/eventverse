const Event = artifacts.require("Event");

module.exports = function (deployer) {
  deployer.deploy(Event, { value: web3.utils.toWei("1", "ether") });
};
