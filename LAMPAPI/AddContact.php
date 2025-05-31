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
    $phoneFromFrontend = $inData["phone"]; // Renamed to avoid confusion
    $email = $inData["email"];

    // ** START OF PHONE SANITIZATION **
    // Sanitize the phone number: Remove non-numeric characters
    $sanitizedPhone = preg_replace('/[^0-9]/', '', $phoneFromFrontend);

    // Optional: Validate the sanitized phone number (e.g., check length)
    // Adjust '10' if you expect a different length or have other validation rules
    if (strlen($sanitizedPhone) < 7 || strlen($sanitizedPhone) > 15) { // Example: allow between 7 and 15 digits
        returnWithError("Invalid phone number format or length. Please enter a valid phone number.");
        exit(); // Stop script execution if phone number is invalid
    }
    // ** END OF PHONE SANITIZATION **


    $conn = new mysqli("localhost", "Retro", "Reach", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    
    else
    {
        // Use $sanitizedPhone in your SQL statement
        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
        // Bind the sanitized phone number to the statement
        $stmt->bind_param("ssssi", $firstName, $lastName, $sanitizedPhone, $email, $userId); 
        
        if ($stmt->execute()) 
        {
            // Suggestion: For a successful operation, you might want to return more than just an error-formatted message.
            // Perhaps a success message or the ID of the newly created contact.
            // For now, let's make the "error" field clearly indicate success.
            $retValue = '{"id":"' . $stmt->insert_id . '", "firstName":"' . $firstName . '", "lastName":"' . $lastName . '", "phone":"' . $sanitizedPhone . '", "email":"' . $email . '", "userID":"' . $userId . '", "message":"Contact added successfully!"}';
            sendResultInfoAsJson($retValue);
        } 
        else 
        {
            returnWithError("Database error: " . $stmt->error); // More specific error
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
        $retValue = '{"error":"' . addslashes($err) . '"}'; // Added addslashes for safety if $err contains quotes
        sendResultInfoAsJson( $retValue );
    }
    
?>