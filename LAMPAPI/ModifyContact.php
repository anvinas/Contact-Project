    <?php

        session_start(); //Session for server-side ID caching

        // CORS headers
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: Content-Type");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

        if (!isset($_SESSION["userID"])) 
        {
            returnWithError("User not logged in"); 
            exit();
        }

        $inData = getRequestInfo(); // Receives JSON payload

        //Server login
        $conn = new mysqli("localhost", "Retro", "Reach", "COP4331"); 
        
        $userID = $_SESSION["userID"];
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
            //Prepares SQL command
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?");
            $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $contactId, $userID);
            $stmt->execute();

            //Checks for any edited users, else returns error
            if ( $stmt->affected_rows > 0)
            {
                returnWithInfo($firstName, $lastName, $contactId);
            }
            else 
            {
                returnWithError("No changes made");
            }

            $stmt->close();
            $conn->close();
        }

        //Helper functions
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

        function getRequestInfo()
        {
            return json_decode(file_get_contents('php://input'), true);
        }
?>
