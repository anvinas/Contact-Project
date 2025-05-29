<?php
session_start();

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");


if (!isset($_SESSION["userID"])) {
	returnWithError("User not logged in");
	exit();
}

$userID = $_SESSION["userID"];
$inData = getRequestInfo();
$search = trim($inData["search"]);

$conn = new mysqli("localhost", "Retro", "Reach", "COP4331");

if ($conn->connect_error) {
	returnWithError($conn->connect_error);
	exit();
}

$searchFirstLast = explode(" ", $search);
if (count($searchFirstLast) === 2) {
	$first = "%" . $searchFirstLast[0] . "%";
	$last  = "%" . $searchFirstLast[1] . "%";
	$stmt = $conn->prepare("SELECT FirstName, LastName, Email, Phone FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID = ?");
	$stmt->bind_param("ssi", $first, $last, $userID);
} else {
	$name = "%" . $search . "%";
	$stmt = $conn->prepare("SELECT FirstName, LastName, Email, Phone FROM Contacts WHERE FirstName LIKE ? AND LastName LIKE ? AND UserID = ?");
	$stmt->bind_param("ssi", $name, $name, $userID);
}

$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
	$contacts[] = $row;
}

if (empty($contacts)) {
	returnWithError("No Records Found");
} else {
	sendResultInfoAsJson(array("results" => $contacts, "error" => ""));
}

$stmt->close();
$conn->close();


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
	sendResultInfoAsJson(array(
		"results" => [],
		"error" => $err
	));
}
?>
