const path = require('path');
const fs = require('fs');
const solc = require('solc');

function get_sc_object(smartContract){
  const inboxPath = path.resolve(__dirname, 'contracts', smartContract +".sol");
  const source = fs.readFileSync(inboxPath, 'utf8');
  
  var solcInput = {
      language: "Solidity",
      sources: { 
          contract: {
              content: source
          }
       },
      settings: {
          optimizer: {
              enabled: true
          },
          evmVersion: "byzantium",
          outputSelection: {
              "*": {
                "": [
                  "legacyAST",
                  "ast"
                ],
                "*": [
                  "abi",
                  "evm.bytecode.object",
                  "evm.bytecode.sourceMap",
                  "evm.deployedBytecode.object",
                  "evm.deployedBytecode.sourceMap",
                  "evm.gasEstimates"
                ]
              },
          }
      }
  };
  
  solcInput = JSON.stringify(solcInput);
  var contractObject = solc.compile(solcInput);
  contractObject = JSON.parse(contractObject);
  
  return contractObject.contracts.contract[smartContract];
}

module.exports = get_sc_object;