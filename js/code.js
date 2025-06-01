	const urlBase = 'http://retro-reach.online/LAMPAPI';
	const extension = 'php';

	let userId = 0;
	let firstName = "";
	let lastName = "";
	let currentEditContactID = -1;

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
								<button class="btn" onclick="handleOpenDeleteContactModal(${c.ID})">Delete</button>
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

				jsonObject.results.forEach(c => {
					const wrapper = document.createElement('div');
					wrapper.className = 'contactRowWrapper';

					// Profile Initials
					const profile = document.createElement('div');
					profile.className = 'contactProfileCircle';
					const initials = (c.FirstName?.[0] || '') + (c.LastName?.[0] || '');
					profile.textContent = initials.toUpperCase();

					// Card container
					const responsiveContainer = document.createElement('div');
					responsiveContainer.className = 'responsiveContainer';

					const card = document.createElement('div');
					card.className = 'contactCard';

					const info = document.createElement('div');
					info.className = 'contactInfo';
					info.innerHTML = `
					<h3>${c.FirstName} ${c.LastName}</h3>
					<p>${c.Phone}</p>
					<p>${c.Email}</p>
					`;

					card.appendChild(info);
					responsiveContainer.appendChild(card);

					// Buttons
					const actions = document.createElement('div');
					actions.className = 'contactActions';
					actions.innerHTML = `
					<button onclick="modifyContact(${c.ID})">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
					</button>
					<button onclick="deleteContact(${c.ID})">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>
					</button>
					`;

					// Append all
					wrapper.appendChild(profile);
					wrapper.appendChild(responsiveContainer);
					wrapper.appendChild(actions);
					contactFlex.appendChild(wrapper);
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

	function updateContact()
	{
		
		if(currentEditContactID == -1)
		{
			console.log("Selected Contact ID not found");
			return;
		}
		else
		{

		changedFistName = document.getElementById("modifyContactFirstName").value;
		changedLastName = document.getElementById("modifyContactLastName").value;
		changedPhone = document.getElementById("modifyContactPhone").value;
		changedEmail = document.getElementById("modifyContactEmail").value;


		let tmp = {firstName: changedFistName, lastName: changedLastName, phone: changedPhone, email: changedEmail, contactId: currentEditContactID}; // Ensure contactId is valid here
		console.log(tmp);
		let jsonPayload = JSON.stringify(tmp);
		let url = urlBase + '/ModifyContact.' + extension;

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

						//ADD Toast here if successfull
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				//document.getElementById("contactSearchResult").innerHTML = err.message;
			}

		currentEditContactID = -1;

		handleCloseModifyContactModal();

		}

	}





	function doDelete()
	{
		let tmp = {contactID: currentEditContactID }; // Ensure userId is valid here
		console.log(tmp);
		console.log(currentEditContactID);
		let jsonPayload = JSON.stringify(tmp);
		let url = urlBase + '/DeleteContact.' + extension;

		
		console.log(tmp);
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

						//ADD Toast here if successfull
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				//document.getElementById("contactSearchResult").innerHTML = err.message;
				console.log("error", err);
			}

			

		currentEditContactID = -1;
		console.log(currentEditContactID);
		handleCloseDeleteContactModal();
	}



	//modals
	const handleOpenCreateContactModal = ()=>{
    const modalEl = document.querySelector("#createModalContainer");
    console.log(modalEl)
    if(modalEl){
        modalEl.classList.remove("closedModal")
    }
}

// Handle closing My Create Contact Modal
const handleCloseCreateContactModal = ()=>{
    const modalEl = document.querySelector("#createModalContainer");
    if(modalEl){
        modalEl.classList.add("closedModal")
    }
}

//Handle Open My Delete Contact Modal
const handleOpenDeleteContactModal = (ID)=>{
    const modalEl = document.querySelector("#deleteModalContainer");
    currentEditContactID = ID;

    console.log(modalEl)
    if(modalEl){
        modalEl.classList.remove("closedModal")
    }
}

// Handle closing My Delete Contact Modal
const handleCloseDeleteContactModal = ()=>{
    const modalEl = document.querySelector("#deleteModalContainer");
    if(modalEl){
        modalEl.classList.add("closedModal")
    }
}


//Handle Open My Modify Contact Modal
const handleOpenModifyContactModal = ()=>{
    const modalEl = document.querySelector("#modifyModalContainer");
    console.log(modalEl)
    if(modalEl){
        modalEl.classList.remove("closedModal")
    }
}

// Handle closing My Modify Contact Modal
const handleCloseModifyContactModal = ()=>{
    const modalEl = document.querySelector("#modifyModalContainer");
    if(modalEl){
        modalEl.classList.add("closedModal")
    }
}