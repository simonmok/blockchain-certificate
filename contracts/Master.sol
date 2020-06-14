pragma solidity ^0.4.23;

contract Master {
    
    struct Certificate {
        address student;
        address issuer;
        string courseTitle;
        string completionDate;
        string expiryDate;
    }
    
    struct Student {
        string name;
    }
    
    struct Issuer {
        string issuerName;
        string logoUrl;
        string issuerAddress;
    }

    mapping (address => Student) private students;
    address[] private studentAddresses;
    
    mapping (address => Issuer) private issuers;
    address[] private issuerAddresses;

	Certificate[] private certificates;

    address private owner;
    
    constructor() public {
        owner = msg.sender;
    }

    // create new student
    function createStudent(address _address, string _name) public {
        
        // Check current user is owner
        require(owner == msg.sender);

		// Check if account already exists
		validateAddress(_address);
		
        // Add a new student contract to students map
         students[_address] = Student({
            name: _name
        });
        
        // Add the address to studentAddresses array
        studentAddresses.push(_address);
    }
    
    function listStudentAddresses() public view returns (address[]) {
        
        return studentAddresses;
    }

    function listIssuerAddresses() public view returns (address[]) {
        
        return issuerAddresses;
    }

    function getStudentName(address _address) public view returns (string) {
		
        for (uint count = 0; count < studentAddresses.length; count++) {
            if (studentAddresses[count] == _address) {
                return students[_address].name;
            }
        }
		
        revert();
    }

	function getIssuerName(address _address) public view returns (string) {
		
        for (uint count = 0; count < issuerAddresses.length; count++) {
            if (issuerAddresses[count] == _address) {
                return issuers[_address].issuerName;
            }
        }
		
        revert();
    }

	function getIssuerDetails(address _address) public view returns (string, string, string) {

        for (uint count = 0; count < issuerAddresses.length; count++) {
            if (issuerAddresses[count] == _address) {
				Issuer storage issuer = issuers[_address];
                return (issuer.issuerName, issuer.logoUrl, issuer.issuerAddress);
            }
        }
		
        revert();
    }

    // create new issuer
    function createIssuer(address _address, string _name, string _issuerAddress, string _logoUrl) public {
        
        // Check current user is owner 
        require(owner == msg.sender);

		// Check if account already exists
		validateAddress(_address);
		
        // Add a new issuer contract to issuers map
         issuers[_address] = Issuer({
            issuerName: _name,
            issuerAddress: _issuerAddress,
            logoUrl: _logoUrl
        });
        
        // Add the address to issuerAddresses array
        issuerAddresses.push(_address);
    }
	
	function validateAddress(address _address) view private {
		
		// Check if account already exists
		for (uint count = 0; count < studentAddresses.length; count++) {
            if (studentAddresses[count] == _address) {
                revert();
            }
        }
		
		for (count = 0; count < issuerAddresses.length; count++) {
            if (issuerAddresses[count] == _address) {
                revert();
            }
        }

		if (_address == owner) {
            revert();
        }
	}

    // create new certificate (issuer)
    function createCertificate(address student, string courseTitle, string completionDate, string expiryDate) public {

		for (uint studentCount = 0; studentCount < studentAddresses.length; studentCount++) {
            if (studentAddresses[studentCount] == student) {
                for (uint issuerCount = 0; issuerCount < issuerAddresses.length; issuerCount++) {
					if (issuerAddresses[issuerCount] == msg.sender) {
						certificates.push(Certificate({
							student: student,
							issuer: msg.sender,
							courseTitle: courseTitle,
							completionDate: completionDate,
							expiryDate: expiryDate
						}));
						return;
					}
				}
            }
        }
		
		revert();
    }
    
    // Verify a certificate
    function verifyCertificate(address student, address issuer, string courseTitle) public view returns (uint) {
        
		for (uint count = 0; count < certificates.length; count++) {
			Certificate storage certificate = certificates[count];
			if (certificate.student == student && certificate.issuer == issuer && equal(certificate.courseTitle, courseTitle)) {
				return count + 1;
			}
		}
		
		// validate expiry date
		
		return 0;
    }

    // Student to query his/her own certificates
	function getStudentCertificates() public view returns (uint[]) {
	    
	    uint[] memory studentCertificates = new uint[](certificates.length);
	    uint index = 0;
	    for (uint count = 0; count < certificates.length; count++) {
	        if (certificates[count].student == msg.sender) {
			    studentCertificates[index++] = count + 1;
	        }
		}
		return studentCertificates;
	}
	
	// Issuer to query issued certificates
	function getIssuerCertificates() public view returns (uint[]) {
	    
	    uint[] memory issuedCertificates = new uint[](certificates.length);
	    uint index = 0;
	    for (uint count = 0; count < certificates.length; count++) {
	        if (certificates[count].issuer == msg.sender) {
			    issuedCertificates[index++] = count + 1;
	        }
		}
		return issuedCertificates;
	}

	function getCertificateDetails(uint index) public view returns (string, string, string, string, string) {

		require(index < certificates.length);
		Certificate storage certificate = certificates[index];
		return (issuers[certificate.issuer].issuerName, students[certificate.student].name, certificate.courseTitle, certificate.completionDate, certificate.expiryDate);
	}

	function compare(string _a, string _b) private pure returns (int) {

        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) minLength = b.length;
        for (uint i = 0; i < minLength; i ++)
            if (a[i] < b[i])
                return -1;
            else if (a[i] > b[i])
                return 1;
        if (a.length < b.length)
            return -1;
        else if (a.length > b.length)
            return 1;
        else
            return 0;
    }

    function equal(string _a, string _b) private pure returns (bool) {

        return compare(_a, _b) == 0;
    }
    
}