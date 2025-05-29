<?php

	session_start(); // Session for ID serverside caching

	// CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	

	$inData = getRequestInfo();

	//Correct user logged in check
	if (!isset($_SESSION["userID"])) 
	{
    	returnWithError("User not logged in.");
    	exit();
	}
	
	$userId = $_SESSION["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];


	$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);
		
		if ($stmt->execute()) 
		{
        	returnWithInfo("Contact added successfully for user $userId.");
    	} 
		
		else 
		{
       		returnWithError($stmt->error);
    	}
		
		$stmt->close();
		$conn->close();
	}

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