requireJS.require(['settings', 'web3', 'jquery', 'bootstrap'], function (settings) {

	$(document).ready(function () {

		var web3 = new Web3(new Web3.providers.HttpProvider(settings.provider));

		if (web3.isConnected()) {

			console.log('Web3 successfully connected');
			var studentAccount = web3.eth.accounts[2];
			var masterContract = web3.eth.contract(settings.abiDefinition);
			var contractInstance = masterContract.at(settings.contractAddress);
			web3.eth.defaultAccount = studentAccount;

			try {
				var studentName = contractInstance.getStudentName(studentAccount);
				$('h1').html('My Certificates - ' + studentName);
				$('#student-name').text(studentName);
			} catch (e) {
				console.log(e);
				$('table').replaceWith('<div class="alert alert-warning">Student not found</div>');
			}

			var certificates = contractInstance.getStudentCertificates();
			console.log(certificates.length + " certificate record(s) loaded");

			if (certificates.length > 0) {
				certificates.forEach(function (index) {
					var certificateDetails = contractInstance.getCertificateDetails(index);
					var expiry = certificateDetails[4] ? certificateDetails[4] : "N/A";
					var issuer = '<a class="cert-button" data-toggle="modal" data-target="#certModal" style="cursor: pointer">' + certificateDetails[0] + '</a>';
					$('table tbody').append('<tr><td>' + issuer + '</td><td>' + certificateDetails[2] + '</td><td>' + certificateDetails[3] + '</td><td>' + expiry + '</td></tr>');
					$('table').show();
				});
			} else {
				$('table').replaceWith('<div class="alert alert-warning">You have no certificates.</div>');
			}
			$('table').on('click', '.cert-button', function () {
				var issuer = $(this).text();
				var courseTitle = $(this).parent().next();
				var completionDate = courseTitle.next();
				$('#issuer-name').text(issuer);
				$('#course-title').text(courseTitle.text());
				$('#completion-date').text(completionDate.text());
			});
		} else {
			$('table').replaceWith('<div class="alert alert-danger">Blockchain not connected</div>');
		}
	});
});