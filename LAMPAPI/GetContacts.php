<?php
    //This php file returns ALL contacts for a specific userID

    session_start(); // Session start for server-side ID Caching

    // CORS headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

    //Checks if a user is logged in
    if (!isset($_SESSION["userID"])) 
    {
        returnWithError("User not logged in"); 
        exit();
    }

    //Logs into server
    $conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

    //Scans userID from session
    $userID = $_SESSION["userID"];

    if ($conn->connect_error)
    {
        returnWithError($conn->connect_error); 
    }
    else 
    {
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ?"); //pushes new contact
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $contacts = array(); //user-specific contacts array

        //Populates array with contacts based on User ID
        while ($row = $result->fetch_assoc())
        {
            $contacts[] = $row;
        }

        returnWithInfo($contacts);

        $stmt->close();
        $conn->close();
    }

    function sendResultInfoAsJson($obj) 
    {
        header('Content-type: application/json');
        echo json_encode($obj);
    }

    function returnWithError($err) 
    {
        $retValue = array("results" => [], "error" => $err);
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($results) 
    {
        $retValue = array("results" => $results, "error" => "");
        sendResultInfoAsJson($retValue);
    }

?>
