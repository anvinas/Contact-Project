<?php

	session_start(); // Session for ID serverside caching

	// CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

	//Correct user logged in check
	if (!isset($_SESSION["userID"])) 
	{
    	returnWithError("User not logged in.");
    	exit();
	}

	$inData = getRequestInfo(); //Receiving JSON payload

	//Logs into server
	$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

	$userId = $_SESSION["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		//Prepares SQL command
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
		
		//Executes command, then responds
		if ($stmt->execute()) 
		{
        	returnWithError("Contact added successfully for user $userId.");
    	} 
		else 
		{
       		returnWithError($stmt->error);
    	}
		
		$stmt->close();
		$conn->close();
	}

	//Helper functions
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>