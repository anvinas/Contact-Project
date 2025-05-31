	const urlBase = 'http://retro-reach.online/LAMPAPI';
	const extension = 'php';

	let userId = 0;
	let firstName = "";
	let lastName = "";
	let currentEditContactID = "";

	function goToSignup()
	{
		window.location.href = "signup.html";
	}
	function goToLogin()
	{
		window.location.href = "index.html";
	}
	function doLogin()
	{
		userId = 0;
		firstName = "";
		lastName = "";
		
		let login = document.getElementById("loginName").value;
		let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );
		
		document.getElementById("loginResult").innerHTML = "";

		let tmp = {login:login,password:password};
	//	var tmp = {login:login,password:hash};
		let jsonPayload = JSON.stringify( tmp );
		
		let url = urlBase + '/Login.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					let jsonObject = JSON.parse( xhr.responseText );
					userId = jsonObject.id;
			
					if( userId < 1 )
					{		
						document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
						return;
					}
			
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

					saveCookie();
		
					window.location.href = "User_Contacts.html";
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("loginResult").innerHTML = err.message;
		}

	}

	function saveCookie()
	{
		let minutes = 20;
		let date = new Date();
		date.setTime(date.getTime()+(minutes*60*1000));	
		document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
	}

	function readCookie()
	{
		userId = -1;
		let data = document.cookie;
		let splits = data.split(",");
		for(var i = 0; i < splits.length; i++) 
		{
			let thisOne = splits[i].trim();
			let tokens = thisOne.split("=");
			if( tokens[0] == "firstName" )
			{
				firstName = tokens[1];
			}
			else if( tokens[0] == "lastName" )
			{
				lastName = tokens[1];
			}
			else if( tokens[0] == "userId" )
			{
				userId = parseInt( tokens[1].trim() );
			}
		}
		
		if( userId < 0 )
		{
			window.location.href = "index.html";
		}
		else
		{
			document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
			displayFirstFourContacts();
		}
	}

	function doLogout()
	{
		userId = 0;
		firstName = "";
		lastName = "";
		document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
		window.location.href = "index.html";
	}

	function clearAllAddContactValidators(){
		const validatorEls = document.getElementsByClassName("invalidValue")
		for (let i = 0; i < validatorEls.length; i++) {
			validatorEls[i].classList.add("hideText");
		}
	
	}

	function addContact()
	{
		clearAllAddContactValidators();

		let firstName = document.getElementById("contactFirstName").value;
		document.getElementById("contactAddResult").innerHTML = "";
		//Output result of contact added later
		let lastName = document.getElementById("contactLastName").value;
		let phoneNumber = document.getElementById("contactPhone").value;
		let email = document.getElementById("contactEmail").value;
		let isAllInputValid = true;

		//Validate first name input
		if(firstName == null || firstName == "") 
		{
			isAllInputValid = false;
			document.getElementById("firstNameValidatorText").classList.remove("hideText");
		}
		
		//Validate last name input
		if(lastName == null || lastName == "")
		{
			isAllInputValid = false;
			document.getElementById("lastNameValidatorText").classList.remove("hideText");
		}
		
		// Validate phone number
		if(!isNaN(Number(phoneNumber)) == false || phoneNumber.length != 10 || phoneNumber == null || phoneNumber == "") 
		{
			isAllInputValid = false;
			document.getElementById("phoneNumberValidatorText").classList.remove("hideText");
		}

		//Validate parts around "@" in email
		if(email == null || email == "" || email.includes("@") == false || email.split("@")[0].length <= 0 || email.split("@")[1].length <= 0)
		{
			isAllInputValid = false;
			document.getElementById("emailValidatorText").classList.remove("hideText");
		}else

		//Vlaidate parts around the "." in email
		if(email.split("@")[1].includes(".") == false || email.split("@")[1].split(".")[0].length <= 0 || email.split("@")[1].split(".")[1].length <= 0)
		{
			isAllInputValid = false;
			console.log("Invalid Email. Needs proper address");
			document.getElementById("emailValidatorText").classList.remove("hideText");
		}

		if(isAllInputValid)
		{	
			let tmp = {firstName: firstName, lastName: lastName, phone: phoneNumber, email:email};
			let jsonPayload = JSON.stringify( tmp );
			console.log(jsonPayload);
			let url = urlBase + '/AddContact.' + extension;
			
			let xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
			try
			{
				xhr.onreadystatechange = function() 
				{
					if (this.readyState == 4 && this.status == 200) 
					{
						document.getElementById("contactAddResult").innerHTML = "Contact has been added";
						console.log(xhr.responseText);
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				document.getElementById("contactAddResult").innerHTML = err.message;
			}
		}
	
	}	

	function searchContact()
	{
		let srch = document.getElementById("searchText").value;
		document.getElementById("contactSearchResult").innerHTML = "";
		
		let contactList = "";

		let tmp = {search:srch};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + '/SearchContact.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					//document.getElementById("contactSearchResult").innerHTML = "Contacts(s) have been retrieved";
					let jsonObject = JSON.parse( xhr.responseText );
					
					console.log("Response from PHP:", jsonObject); //Php debugging

					for( let i=0; i<jsonObject.results.length; i++ )
					{
						let c = jsonObject.results[i];

						contactList += `${c.FirstName} ${c.LastName}, ${c.Email}, ${c.Phone}`; //Formatting results, emphasis on backticks "`"
						if( i < jsonObject.results.length - 1 )
						{
							contactList += "<br />\r\n";
						}
						
						//contactList += jsonObject.results[i];
						//if( i < jsonObject.results.length - 1 )
						//{
						//	contactList += "<br />\r\n";
						//}
					}
					
					document.getElementsByTagName("p")[0].innerHTML = contactList;
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactSearchResult").innerHTML = err.message;
		}
		
	}

function displayFirstFourContacts()
{
	let tmp = {UserID: userId }; // Ensure userId is valid here
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/GetContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			let jsonObject = JSON.parse(xhr.responseText);
			console.log("API Response:", jsonObject);
			let contacts = jsonObject.results.slice(0, 4);
			
			let contactFlex = document.querySelector('.contactFlex');
			if (!contactFlex) {
				console.error("contactFlex element not found in HTML.");
				return;
			}

			contactFlex.innerHTML = '';

			contacts.forEach(c => {
				console.log(c)
				let div = document.createElement('div');
				div.className = 'contactCard';
				div.innerHTML = `
					<div class="contactInfo">
						<strong>${c.FirstName} ${c.LastName}</strong><br>
						Phone: ${c.Phone}<br>
						Email: ${c.Email}
					</div>
					<div class="contactActions">
						<button onclick="modifyContact(${c.ID})">Modify</button>
						<button onclick="deleteContact(${c.ID})">Delete</button>
					</div>
				`;
				contactFlex.appendChild(div);
			});
		}
	};

	try {
		xhr.send(jsonPayload);
	} catch (err) {
		console.error("Request failed:", err.message);
	}
} 

/*
function displayFirstFourContacts()
{
	// Simulated/fake data (what you'd expect from your server)
	let mockContacts = [
		{ ID: 1, FirstName: "Jane", LastName: "Doe", Phone: "1234567890", Email: "jane@example.com" },
		{ ID: 2, FirstName: "John", LastName: "Smith", Phone: "9876543210", Email: "john@example.com" },
		{ ID: 3, FirstName: "Alice", LastName: "Brown", Phone: "4567891234", Email: "alice@example.com" },
		{ ID: 4, FirstName: "Bob", LastName: "White", Phone: "3216549870", Email: "bob@example.com" }
	];

	let contactFlex = document.querySelector('.contactFlex');
	if (!contactFlex) {
		console.error("contactFlex element not found.");
		return;
	}

	contactFlex.innerHTML = '';

	mockContacts.forEach(c => {
		let div = document.createElement('div');
		div.className = 'contactCard';
		div.innerHTML = `
			<div class="contactInfo">
				<strong>${c.FirstName} ${c.LastName}</strong><br>
				Phone: ${c.Phone}<br>
				Email: ${c.Email}
			</div>
			<div class="contactActions">
				<button class="btn" onclick="modifyContact(${c.ID})">Modify</button>
				<button class="btn" onclick="deleteContact(${c.ID})">Delete</button>
			</div>
		`;
		contactFlex.appendChild(div);
	});
}
*/


function doModify(id)
{

	let tmp = {contactID: id}; // Ensure contactId is valid here
	currentEditContactID = id;

	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/SearchContactByID.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					let jsonObject = JSON.parse( xhr.responseText );
					
					console.log("Response from PHP:", jsonObject); //Php debugging

					document.getElementById("modifyContactFirstName").innerHTML = jsonObject.FirstName;
					document.getElementById("ModifyContactLastName").innerHTML = jsonObject.LastName;
					document.getElementById("ModifyContactPhone").innerHTML = jsonObject.Phone;
					document.getElementById("ModifyContactEmail").innerHTML = jsonObject.Email;
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			//document.getElementById("contactSearchResult").innerHTML = err.message;
		}


	handleOpenModifyContactModal();



}

function doDelete()
{
	let tmp = {UserID: userId }; // Ensure userId is valid here
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/DeleteContact.' + extension;
}