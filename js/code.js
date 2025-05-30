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
		let srch = document.getElementById("searchText").value.trim();

		if (srch === "") {
		displayFirstFourContacts();
		return;
		}

		let contactFlex = document.querySelector('.contactFlex');

		if (!contactFlex) {
			console.error("contactFlex element not found.");
			return;
		}

		contactFlex.innerHTML = "";

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
					let jsonObject = JSON.parse( xhr.responseText );

					console.log("Response from PHP:", jsonObject); //Php debugging

					if (!jsonObject.results || jsonObject.results.length === 0) {
						return;
					}

					jsonObject.results.forEach(c => {
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
				};
			}
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
							<button onclick="handleOpenDeleteContactModal()">Delete</button>
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

	function modifyContact(id)
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

						document.getElementById("modifyContactFirstName").value = jsonObject.FirstName;
						document.getElementById("modifyContactLastName").value = jsonObject.LastName;
						document.getElementById("modifyContactPhone").value = jsonObject.Phone;
						document.getElementById("modifyContactEmail").value = jsonObject.Email;
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