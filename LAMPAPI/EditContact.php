    <?php

        session_start();

        //This php file lets a user modify their contact list
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
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?");
            $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userID);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            returnWithInfo("$firstName, $lastName, $contactId");
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
        
        function returnWithInfo( $firstName, $lastName, $id )
        {
            $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
            sendResultInfoAsJson( $retValue );
        }
?>
