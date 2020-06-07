# blockchain-certificate
This Dapps allows certificate issuers to create certification records for learners. Certificate records can be verified by a search function. Certificate records are stored in Ethereum blockchain on TestRPC (or Ganache) test network.

Go through the following steps to run the apps.

1. Run Ganache-cli with the command node_modules/.bin/ganache-cli
2. Run deploy-contract.js to create some initial testing data.
3. From Step 1, note the contract address. Configure it under "contractAddress" at js/lib/app-config.js
4. Launch http://localhost to start browsing the apps.
