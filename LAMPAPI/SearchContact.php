<?php
	session_start();

	if(!isset($_SESSION("userID"))){
		returnWithError("User not logged in");
		exit();
	}

	$userID = $_SESSION["userID"];
	$inData = getRequestInfo();
	$search = trim($inData["search"]);

	$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
		exit()
	} 
	else
	{
		$searchFirstLast = explode (" ", $search);
		if(count($searchFirstLat) === 2)
		{
			$first = "%" . $searchFirstLast[0]  . "%";
			$last = "%" .$searchFirstLast[1] . "%";
		

		$stmt = $conn->prepare("SELECT FirstName, LastName from Contacts where (FirstName like ? OR Lastname like ?) and UserID=?");
		$contactName = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssi", $first, $last, $userID);
		}
		else 
		{
			$name = "%" . $search . "%";
			$stmt = $conn->prepare("SELECT firstName, lastName, email, phone FROM Contacts WHERE firstName LIKE ? AND LastName LIKE ? and UserID = ?");
			$stmt->bind_param("ssi", $name, $name, $userID);
		}
		$stmt->execute();
		$result = $stmt->get_result();

		$contacts = [];
		
		while($row = $result->fetch_assoc())
		{
			$contacts[] = $row;
		}
		
		if(empty($contacts))
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfoAsJson(["results" => $contacts, "error" => ""]);
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