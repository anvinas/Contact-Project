<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    $user_input_login = $inData("Login");
    $firstName = $inData("First Name");
    $lastName = $inData("Last Name");
    $user_input_password = $inData("Password");
    $user_input_email = $inData("Email");
    $user_input_phone_number = $inData("Phone Number");

    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    else
    {
        $check_exist = $conn->prepare("Select ID from users where Login = ?");
        $check_exist->bind_param("s", $User_input_username);
        $check_exist->execute();
        $check_exist->store_result();

        if ($check_exist->num_rows > 0)
        {
            returnWithError("Username taken");
        } 
        else         
        {

        $stmt = $conn->prepare(
            "INSERT INTO Users (FirstName, LastName, Login, Password, DateCreated) VALUES (?, ?, ?, ?, NOW())"
        );
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        $stmt->execute();

        returnWithError("");
        $stmt->close();
        
        }

        $check_exist->close();
        $conn->close();
    }


    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
?>

    



