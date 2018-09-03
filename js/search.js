requireJS.require(['settings', 'web3', 'jquery', 'bootstrap'], function (settings) {

	$(document).ready(function () {
		
		var web3 = new Web3(new Web3.providers.HttpProvider(settings.provider));

		if (web3.isConnected()) {

			console.log('Web3 successfully connected');
			var masterContract = web3.eth.contract(settings.abiDefinition);
			var contractInstance = masterContract.at(settings.contractAddress);

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
});