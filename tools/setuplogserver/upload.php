<?PHP //upload.php

// basic configuration

$log_dir = "logs";
$store_dir = "./" . $log_dir . "/";
$accept_overwrite = 0;
$file_size_max = 20 * 1024 * 1024;

mkdir($log_dir);

//error_reporting(E_ALL);
header("content=text/html; charset=utf-8");
$uf = $_FILES['fileToUpload'];
$upload_file_size = $_FILES['fileToUpload']['size'];

if (!$uf) {
    echo "No fileToUpload index";
    exit();
}

$upload_file_temp = $uf['tmp_name'];
$upload_file_name = $uf['name'];
if (!$upload_file_temp) {
    echo "Upload failed";
    exit();
}


if ($upload_file_size > $file_size_max) {
    echo "Sorry, your file size exceeds the allowable range: " . $file_size_max;
    exit();
}

$file_path = $store_dir . $upload_file_name;

if (file_exists($file_path) && !$accept_overwrite) {
    echo "File exist.";
    exit();
}

if (!move_uploaded_file($upload_file_temp, $file_path)) {
    echo "Failed to copy file" . $upload_file_temp . " to " . $file_path;
    exit;
}

echo "<p>You uploaded the file:";
echo $upload_file_name;
echo "<br>";
echo "MIME is:";
echo $uf['type'];
echo "<br>";

echo "file size:";
echo $uf['size'];
echo "<br>";

echo "file temporary folder:";
echo $uf['tmp_name'];
echo "<br>";

$error = $uf['error'];
switch ($error) {
    case 0:
        Echo "upload success";
    break;
    case 1:
        Echo "size of uploaded file exceed the upload_max_filesize limitation.";
    break;
    case 2:
        Echo "size of uploaded file exceed MAX_FILE_SIZE of html form.";
    break;
    case 3:
        Echo "only part of file uploaded";
    break;
    case 4:
        Echo "no file was uploaded";
    break;
}
?>

