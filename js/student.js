requireJS.require(['settings', 'web3', 'jquery'], function (settings) {

	$(document).ready(function () {

		var web3 = new Web3(new Web3.providers.HttpProvider(settings.provider));

		if (web3.isConnected()) {

			console.log('Web3 successfully connected');
			var account = web3.eth.accounts[0];
			web3.personal.unlockAccount(account);

			var masterContract = web3.eth.contract(settings.abiDefinition);
			var contractInstance = masterContract.at(settings.contractAddress);

			$('form').submit(function (event) {
				$('.alert-danger, .alert-success').hide();
				var address = $("#address").val();
				var fullName = $("#full-name").val();
				var index = web3.eth.accounts.indexOf(address);

				if (index < 0) {
					$('.alert-danger').html('Account address not found.').show();
					console.log('Valid addresses', web3.eth.accounts);
				} else {
					try {
						var estimatedGas = contractInstance.createStudent.estimateGas(address, fullName);
						contractInstance.createStudent(address, fullName, {from: account, gas: estimatedGas});
						$('.alert-success').show();
						$('#address, #full-name').val('');
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