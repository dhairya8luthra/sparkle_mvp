const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SQLQueryModule = buildModule("SQLQueryContractModule", (m) => {
  const c = m.contract("SQLQueryContract");

  return { c };
});

module.exports = SQLQueryModule;
