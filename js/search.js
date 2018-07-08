$(document).ready(function() {
	
	var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

	if (web3.isConnected()) {

		console.log('Web3 successfully connected');
		var abiDefinition = [{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getIssuerName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getStudentName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getIssuerCertificates","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listStudentAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getIssuerDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"student","type":"address"},{"name":"courseTitle","type":"string"},{"name":"completionDate","type":"string"},{"name":"expiryDate","type":"string"}],"name":"createCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getCertificateDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_name","type":"string"},{"name":"_issuerAddress","type":"string"},{"name":"_logoUrl","type":"string"}],"name":"createIssuer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_name","type":"string"}],"name":"createStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"listIssuerAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getStudentCertificates","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"student","type":"address"},{"name":"issuer","type":"address"},{"name":"courseTitle","type":"string"}],"name":"verifyCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
		var contractAddress = '0x64ec4b719fa6b1fb835b7212e1973236be746989';
		var masterContract = web3.eth.contract(abiDefinition);
		var contractInstance = masterContract.at(contractAddress);

		$('form').submit(function (event) {

			$('.alert-warning, .alert-success').hide();
			var student = $("#student").val();
			var issuer = $("#issuer").val();
			var title = $("#title").val();
			var studentIndex = web3.eth.accounts.indexOf(student);
			var issuerIndex = web3.eth.accounts.indexOf(issuer);

			if (studentIndex < 0 || issuerIndex < 0) {
				$('.alert-danger').html('Account address not found.').show();
				console.log('Valid addresses', web3.eth.accounts);
			} else {
				// Search the certificate
				var index = contractInstance.verifyCertificate(student, issuer, title);
				if (index > 0) {
					$('.alert-success').show();
					$("#student, #issuer, #title").val('');
					var certificateDetails = contractInstance.getCertificateDetails(index - 1);
					$('#issuer-name').text(certificateDetails[0]);
					$('#student-name').text(certificateDetails[1]);		
					$('#course-title').text(certificateDetails[2]);
					$('#completion-date').text(certificateDetails[3]);
				} else {
					$('.alert-warning').show();
				}
			}

			event.preventDefault();
		});
	} else {
		$('form').prepend('<div class="alert alert-danger">Blockchain not connected</div>');
		$(':submit').prop('disabled', true);
	}
});