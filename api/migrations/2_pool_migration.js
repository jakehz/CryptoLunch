const pool = artifacts.require("Pool");

module.exports = function (deployer) {
    // this is a dummy address for now; used for testing. 
    // the 100 represents the amount in gwei. Both of these values
    // are sent to the constructor in the smart contract. 
    deployer.deploy(pool, 100, "0x20157959ae7f2e6017ba31b6c1699826e332e1ef");
};
