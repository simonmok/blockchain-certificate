console.log('Deploy started on ' + new Date());
console.log('Loading libraries');

var fs = require('fs');
var Web3 = require('web3');
var solc = require('solc');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

console.log('Compiling Solidity contracts');

var compiled = solc.compile(fs.readFileSync('contracts/Master.sol').toString());
var abiDefinition = compiled.contracts[':Master'].interface;
console.log('ABI Definition: ' + abiDefinition);

var byteCode = compiled.contracts[':Master'].bytecode;
var estimatedGas = web3.eth.estimateGas({data: byteCode});
console.log('Deploying contracts using estimated gas ' + estimatedGas);

var contract = web3.eth.contract(JSON.parse(abiDefinition)).new(null, {data: byteCode, from: web3.eth.accounts[0], gas: estimatedGas});

new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {

    console.log('Contract address: ' + contract.address);
    console.log('Writing dummy data');
    console.log('Creating issuer');
    contract.createIssuer(web3.eth.accounts[1], 'HKU', 'Pokfulam Road, HK', 'http://avuou.hku.hk/guestpage/HKUbw2.gif', {from: web3.eth.accounts[0], gas: contract.createIssuer.estimateGas(web3.eth.accounts[1], 'HKU', 'Pokfulam Road, HK', 'http://avuou.hku.hk/guestpage/HKUbw2.gif')});
    console.log('Creating student');
    contract.createStudent(web3.eth.accounts[2], 'Simon Chan', {from: web3.eth.accounts[0], gas: contract.createStudent.estimateGas(web3.eth.accounts[2], 'Simon Chan')});
    console.log('Creating certificate');
    web3.eth.defaultAccount = web3.eth.accounts[1];
    contract.createCertificate(web3.eth.accounts[2], 'Introduction to Blockchain', '2018-07-01', '2028-08-31', {from: web3.eth.accounts[1], gas: contract.createCertificate.estimateGas(web3.eth.accounts[2], 'Introduction to Blockchain', '2018-07-01', '2028-08-31')});
    console.log('Deploy complete at ' + new Date());
});