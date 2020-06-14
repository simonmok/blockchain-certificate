requireJS.require(['settings', 'web3', 'jquery', 'bootstrap'], function (settings) {

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
				$('h1').html('Issued Certificates - ' + issuerName);
				$('#issuer-name').text(issuerName);
			} catch (e) {
				console.log(e);
				$('table').replaceWith('<div class="alert alert-warning">Issuer not found</div>');
			}

			var certificates = contractInstance.getIssuerCertificates();
			certificates = certificates.filter(value => value > 0);
			console.log(certificates.length + " certificate record(s) loaded");

			if (certificates.length > 0) {
				certificates.forEach(function (index) {
					var certificateDetails = contractInstance.getCertificateDetails(index - 1);
					var expiry = certificateDetails[4] ? certificateDetails[4] : "N/A";
					var student = '<a class="cert-button" data-toggle="modal" data-target="#certModal" style="cursor: pointer">' + certificateDetails[1] + '</a>';
					$('table tbody').append('<tr><td>' + student + '</td><td>' + certificateDetails[2] + '</td><td>' + certificateDetails[3] + '</td><td>' + expiry + '</td></tr>');
					$('table').show();
				});
			} else {
				$('table').replaceWith('<div class="alert alert-warning">No issued certificates</div>');
			}
			$('table').on('click', '.cert-button', function () {
				var student = $(this).text();
				var courseTitle = $(this).parent().next();
				var completionDate = courseTitle.next();
				$('#student-name').text(student);
				$('#course-title').text(courseTitle.text());
				$('#completion-date').text(completionDate.text());
			});
		} else {
			$('table').replaceWith('<div class="alert alert-danger">Blockchain not connected</div>');
		}
	});
});