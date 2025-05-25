<?php

	//This php file lets user add a contact
	
	session_start();

	$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

	$inData = getRequestInfo();

	if (!isset($_SESSION["userId"])) 
	{
    	returnWithError("User not logged in.");
    	exit();
	}
	
	$login = $inData["login"];
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
		"INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)"
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
		returnWithError("");
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