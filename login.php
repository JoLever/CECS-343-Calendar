<?php
$inputid = $_POST['stdid']; //This links the variable $inputid to the student ID on the login page.
$inputpass = $_POST['psw']; //This links the variable $inputpass to the password on the login page.
$host="sql3.freemysqlhosting.net"; // Host name 
$username="sql3148485"; // Mysql username 
$password="B5Pw7Qz4Q3"; // Mysql password 
$db_name="sql3148485"; // Database name 
$tbl_name="members"; // Table name 

$link = mysqli_connect("$host", "$username", "$password", "$db_name");//This is where it attempts the link to the database.

if (!$link) { //This prints out the errors given if the connection to the mysql database fails
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}
//These are the sql statements that compare the user input to the data in the mysql database.
$query = "SELECT * FROM `members` WHERE `id` = '$inputid'";
$querypass = "SELECT * FROM `members` WHERE `password` = '$inputpass'";

$result = mysqli_query($link,$query);//returns either true or false depending on the success of the query.
$resultpass = mysqli_query($link,$querypass);

$row = mysqli_fetch_array($result,MYSQLI_BOTH);//fetches a result row as both an associative array and numeric array and stores it in variable $row.
$rowpass = mysqli_fetch_array($resultpass,MYSQLI_ASSOC);//fetches a result row as an associative array and stores it in variable $rowpass.

$serveruser = $row["id"];
$serverpass = $row["password"];

if($serveruser&&$serverpass){
    if(!$result){
        die("Username or password to database is in invalid");
    }
    mysqli_close($link);
    if($inputpass == $serverpass){//If both the student ID and password are found in the database it will take user to the calendar page.
        header("Location: CalendarPage.html");
    }
    else{
        echo "Student ID or password not found please go back and try again.";//If not found it'll tell the user it was not found.
    }
}


?>