	const urlBase = 'http://retro-reach.online/LAMPAPI';
	const extension = 'php';

	let userId = 0;
	let firstName = "";
	let lastName = "";

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

	function addContact()
{
	let firstName = document.getElementById("contactFirstName").value;
	document.getElementById("contactAddResult").innerHTML = "";
	//Output result of contact added later
	let lastName = document.getElementById("contactLastName").value;
	let phoneNumber = document.getElementById("contactPhone").value;
	let email = document.getElementById("contactEmail").value;

	//Validate first name input
	if(firstName == null || firstName == "") 
	{
		console.log("No first name");
	}
	
	else
	//Validate last name input
	if(lastName == null || lastName == "")
	{
			console.log("No last name");
	}
	
	else
	// Validate phone number
	if(!isNaN(Number(phoneNumber)) == false || phoneNumber.length != 10 || phoneNumber == null || phoneNumber == "") 
	{
		console.log(phoneNumber);
		console.log("Invalid Phone Number");
	}

	else
	//Validate parts around "@" in email
	if(email == null || email == "" || email.includes("@") == false || email.split("@")[0].length <= 0 || email.split("@")[1].length <= 0)
	{
		console.log("Invalid Email");
	}

	else
	//Vlaidate parts around the "." in email
	if(email.split("@")[1].includes(".") == false || email.split("@")[1].split(".")[0].length <= 0 || email.split("@")[1].split(".")[1].length <= 0)
	{
			console.log("Invalid Email. Needs proper address");
	}

	else
	{	
		let tmp = {firstName: firstName, lastName: lastName, phone: phoneNumber, email:email, userId:userId};
		let jsonPayload = JSON.stringify( tmp );

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
					document.getElementById("contactSearchResult").innerHTML = "Contacts(s) have been retrieved";
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
