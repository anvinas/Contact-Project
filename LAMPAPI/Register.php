    <?php

    $inData = getRequestInfo();

    //CORS headers
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $user_input_login = $inData["login"];
    $user_input_password = $inData["password"];
    $user_input_email = $inData["email"];
    $user_input_phone_number = $inData["phoneNumber"];

    $conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $check_exist = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
        $check_exist->bind_param("s", $user_input_login);
        $check_exist->execute();
        $check_exist->store_result();

        if ($check_exist->num_rows > 0) {
            returnWithError("Username taken");
        } else {
            $stmt = $conn->prepare(
                "INSERT INTO Users (FirstName, LastName, Login, Password, DateCreated) VALUES (?, ?, ?, ?, NOW())"
            );
            $stmt->bind_param("ssss", $firstName, $lastName, $user_input_login, $user_input_password);
            $stmt->execute();
            $stmt->close();

            returnWithError(""); 
        }

        $check_exist->close();
        $conn->close();
    }


    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError($err) {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }
?>
