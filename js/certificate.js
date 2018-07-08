$(document).ready(function() {

	var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

	if (web3.isConnected()) {

		console.log('Web3 successfully connected');
		var issuerAccount = web3.eth.accounts[1];
		var abiDefinition = [{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getIssuerName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getStudentName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getIssuerCertificates","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listStudentAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getIssuerDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"student","type":"address"},{"name":"courseTitle","type":"string"},{"name":"completionDate","type":"string"},{"name":"expiryDate","type":"string"}],"name":"createCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getCertificateDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_name","type":"string"},{"name":"_issuerAddress","type":"string"},{"name":"_logoUrl","type":"string"}],"name":"createIssuer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_name","type":"string"}],"name":"createStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"listIssuerAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getStudentCertificates","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"student","type":"address"},{"name":"issuer","type":"address"},{"name":"courseTitle","type":"string"}],"name":"verifyCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
		var contractAddress = '0x64ec4b719fa6b1fb835b7212e1973236be746989';
		var masterContract = web3.eth.contract(abiDefinition);
		var contractInstance = masterContract.at(contractAddress);
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