<?php

    session_start(); //Session start for server-side ID caching

	// CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

	//User logged-in check
	if (!isset($_SESSION["userID"])) {
		returnWithError("User not logged in");
		exit();
	}

    $inData = getRequestInfo();

	//Logs into server
	$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

    $userID = $_SESSION["userID"];
    $contactID = $inData["contactID"];

    if ($conn->connect_error)
    {
        returnWithError("". $conn->connect_error);
    }
    else 
    {
        //Preparing SQL command
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE ID = ? AND UserID = ?");
        $stmt->bind_param("ii", $userID, $contactID);
        $stmt->execute();
        //Storing results
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc())
        {
            returnWithInfo($row);
        }
        else 
        {
            returnWithError("No such matching contact");
        }
        $stmt->close();
        $conn->close();
    }

    //Helper functions
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}

	function returnWithError($err)
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithInfo($contact) 
    {
        $contact["error"] = "";
        sendResultInfoAsJson($contact);
    }   
?>
