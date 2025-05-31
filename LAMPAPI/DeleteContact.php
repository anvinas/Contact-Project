<?php

    session_start(); //Session for server-side ID caching
    
    // CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

    //Correct user logged-in check
    if (!isset($_SESSION["userID"])) 
    {
        returnWithError("User not logged in"); 
        exit();
    }
    
    $inData = getRequestInfo(); //Receives JSON payload

    //Logs into server
    $conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

    $userID = $_SESSION["userID"];
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
        //Prepares SQL command
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
        $stmt->bind_param("ii", $contactId, $userID);
        $stmt->execute();

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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
		
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>