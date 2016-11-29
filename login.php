<?php
$inputid = $_POST['stdid'];
$inputpass = $_POST['psw'];
$host="cecs-db01.coe.csulb.edu"; // Host name 
$username="cecs323b25"; // Mysql username 
$password="saex3p"; // Mysql password 
$db_name="cecs323b25"; // Database name 
$tbl_name="members"; // Table name 

$link = mysqli_connect("$host", "$username", "$password", "$db_name");

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

//echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
//echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;

$query = "SELECT * FROM `members` WHERE `id` = '$inputid'";
$querypass = "SELECT * FROM `members` WHERE `password` = '$inputpass'";

$result = mysqli_query($link,$query);

$resultpass = mysqli_query($link,$querypass);

$row = mysqli_fetch_array($result,MYSQLI_BOTH);
$rowpass = mysqli_fetch_array($resultpass,MYSQLI_ASSOC);

$serveruser = $row["id"];
$serverpass = $row["password"];

if($serveruser&&$serverpass){
    if(!$result){
        die("Username or password in invalid");
    }
    mysqli_close($link);
    if($inputpass == $serverpass){
        header("Location: CalendarPage.html");
    }
    else{
        echo "Student ID or password not found please go back and try again.";
    }
}


?>