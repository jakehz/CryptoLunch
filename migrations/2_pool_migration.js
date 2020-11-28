const pool = artifacts.require("Pool");

module.exports = function (deployer) {
  deployer.deploy(pool, 100, "0x20157959ae7f2e6017ba31b6c1699826e332e1ef");
};
