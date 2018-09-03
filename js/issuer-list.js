requireJS.require(['settings', 'web3', 'jquery'], function (settings) {

	$(document).ready(function () {

		var web3 = new Web3(new Web3.providers.HttpProvider(settings.provider));

		if (web3.isConnected()) {

			console.log('Web3 successfully connected');
			var masterContract = web3.eth.contract(settings.abiDefinition);
			var contractInstance = masterContract.at(settings.contractAddress);
			var issuerAddresses = contractInstance.listIssuerAddresses();
			console.log(issuerAddresses.length + ' issuer record(s) loaded');

			if (issuerAddresses.length > 0) {
				issuerAddresses.forEach(function (address) {
					var issuerDetails = contractInstance.getIssuerDetails(address);
					var businessAddress = issuerDetails[2] ? issuerDetails[2] : '-';
					var imageHtml = issuerDetails[1] ? '<img src="' + issuerDetails[1] + '" style="max-height: 20px" title="' + issuerDetails[0] + '"/>' : '-';
					$('table tbody').append('<tr><td>' + issuerDetails[0] + '</td><td>' + address + '</td><td>' + businessAddress  + '</td><td>' + imageHtml + '</td></tr>');
					$('table').show();
				});
			} else {
				$('table').replaceWith('<div class="alert alert-warning">No issuer accounts in the system</div>');
			}
		} else {
			$('table').replaceWith('<div class="alert alert-danger">Blockchain not connected</div>');
		}
	});
});