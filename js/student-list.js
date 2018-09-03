requireJS.require(['settings', 'web3', 'jquery'], function (settings) {

	$(document).ready(function () {

		var web3 = new Web3(new Web3.providers.HttpProvider(settings.provider));

		if (web3.isConnected()) {

			console.log('Web3 successfully connected');
			var masterContract = web3.eth.contract(settings.abiDefinition);
			var contractInstance = masterContract.at(settings.contractAddress);
			var studentAddresses = contractInstance.listStudentAddresses();
			console.log(studentAddresses.length + ' student record(s) loaded');

			if (studentAddresses.length > 0) {
				studentAddresses.forEach(function (address) {
					// Query the student name from blockchain
					var studentName = contractInstance.getStudentName(address);

					// Append a new HTML table row
					$('table tbody').append('<tr><td>' + studentName + '</td><td>' + address + '</td></tr>');
					$('table').show();
				});
			} else {
				$('table').replaceWith('<div class="alert alert-warning">No student accounts in the system</div>');
			}
		} else {
			$('table').replaceWith('<div class="alert alert-danger">Blockchain not connected</div>');
		}
	});
});