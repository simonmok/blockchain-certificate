$(document).ready(function() {

	var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

	if (web3.isConnected()) {

		console.log('Web3 successfully connected');
		var abiDefinition = [{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getIssuerName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getStudentName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getIssuerCertificates","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"listStudentAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getIssuerDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"student","type":"address"},{"name":"courseTitle","type":"string"},{"name":"completionDate","type":"string"},{"name":"expiryDate","type":"string"}],"name":"createCertificate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getCertificateDetails","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_name","type":"string"},{"name":"_issuerAddress","type":"string"},{"name":"_logoUrl","type":"string"}],"name":"createIssuer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_name","type":"string"}],"name":"createStudent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"listIssuerAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getStudentCertificates","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"student","type":"address"},{"name":"issuer","type":"address"},{"name":"courseTitle","type":"string"}],"name":"verifyCertificate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
		var contractAddress = '0x64ec4b719fa6b1fb835b7212e1973236be746989';
		var masterContract = web3.eth.contract(abiDefinition);
		var contractInstance = masterContract.at(contractAddress);
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