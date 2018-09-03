requireJS.require(['settings', 'web3', 'jquery'], function (settings) {

	$(document).ready(function () {

		var web3 = new Web3(new Web3.providers.HttpProvider(settings.provider));

		if (web3.isConnected()) {

			console.log('Web3 successfully connected');
			var issuerAccount = web3.eth.accounts[1];
			var masterContract = web3.eth.contract(settings.abiDefinition);
			var contractInstance = masterContract.at(settings.contractAddress);
			web3.eth.defaultAccount = issuerAccount;

			try {
				var issuerName = contractInstance.getIssuerName(issuerAccount);
				$('h1').html('Create Certificate - ' + issuerName);
			} catch (e) {
				console.log(e);
				$('.alert-danger').html('Issuer not found.').show();
			}

			$('form').submit(function (event) {
				$('.alert-danger, .alert-success').hide();
				var courseTitle = $("#course-title").val();
				var completionDate = $("#completion-date").val();
				var expiryDate = $("#expiry-date").val();
				var address = $("#address").val();
				var index = web3.eth.accounts.indexOf(address);

				if (index < 0) {
					$('.alert-danger').html('Account address not found.').show();
					console.log('Valid addresses', web3.eth.accounts);
				} else {
					try {
						var estimatedGas = contractInstance.createCertificate.estimateGas(address, courseTitle, completionDate, expiryDate);
						contractInstance.createCertificate(address, courseTitle, completionDate, expiryDate, {from: issuerAccount, gas: estimatedGas});
						$('.alert-success').show();
						$('#course-title, #completion-date, #expiry-date, #address').val('');
					} catch (e) {
						console.log(e);
						$('.alert-danger').html('Error occurred.').show();
					}
				}
				
				event.preventDefault();
			});
		} else {
			$('form').prepend('<div class="alert alert-danger">Blockchain not connected</div>');
			$(':submit').prop('disabled', true);
		}
	});
});