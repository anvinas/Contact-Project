<?php

    session_start();
    //This php file lets a user remove a contact

    // CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

    
    $conn = new mysqli("localhost", "Retro", "Reach", "COP4331"); //Database login

    if (!isset($_SESSION["userID"])) 
    {
        returnWithError("User not logged in"); 
        exit();
    }

    $userID = $_SESSION("userID");
    $inData = getRequestInfo();
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $contactId = $inData["contactId"];

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?"); 
        $stmt = $stmt->bind_param("ii", $contactId, $userID);

        if ($stmt->affected_rows > 0){
            returnWithInfo("Contact with $contactId deleted successfully");
        }
        else
        {
            returnWithError("No matching contact");
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
		
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>