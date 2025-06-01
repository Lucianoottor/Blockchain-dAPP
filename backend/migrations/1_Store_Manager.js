// Em migrations/1_deploy_contracts.js (ou nome similar)
const StoreManager = artifacts.require("StoreManager");

module.exports = function (deployer) {
  deployer.deploy(StoreManager); // Sem argumentos aqui
};