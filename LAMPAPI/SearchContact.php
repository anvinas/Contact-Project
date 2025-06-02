<?php
	session_start();

	// CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

	//User logged-in check
	if (!isset($_SESSION["userID"])) {
		returnWithError("User not logged in");
		exit();
	}

	//Logs into server
	$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

	$inData = getRequestInfo(); //Receives JSON payload

	$userID = $_SESSION["userID"];
	$search = trim($inData["search"]);

	if ($search === "")
	{
		returnWithError("Search is empty!!");
		exit();
	}

	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
		exit();
	}
	else 
	{
		$searchFirstLast = explode(" ", $search); // Splits search string by space
		if (count($searchFirstLast) === 2) 
		{
			//Dynamic strings assigned to variables for search
			$first = "%" . $searchFirstLast[0] . "%";
			$last  = "%" . $searchFirstLast[1] . "%";
			
			//prepares SQL command
			$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
			$stmt->bind_param("ssi", $first, $last, $userID);
		} 
		else 
		{
			//Dynamic string assigned in the case of only firstName or lastName given
			$name = "%" . $search . "%";
			$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Email, Phone FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
			$stmt->bind_param("ssi", $name, $name, $userID);
		}

		$stmt->execute(); //executes prepared SQL command
		$result = $stmt->get_result();

		$contacts = [];

		//Assigns valid searches to elements in an associative contacts array
		while ($row = $result->fetch_assoc()) 
		{
			$contacts[] = $row;
		}

		if (empty($contacts)) 
		{
			returnWithError("No Records Found");
		} 
		else 
		{
			sendResultInfoAsJson(array("results" => $contacts, "error" => "")); //Sends back array-based results JSON
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
		sendResultInfoAsJson(array
		(
			"results" => [],
			"error" => $err
		));
	}
?>
