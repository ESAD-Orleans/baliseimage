<?php
//upload.php
$output_dir = "files/";
$error = false;
$success = false;
$response = array();
$filename = '';
$filepath = '';
//
if(isset($_POST['imageData'])){
	// save base64 encode to file
	$imageData = $_POST['imageData'];

	list($type, $imageData) = explode(';', $imageData);
	list(, $imageData) = explode(',', $imageData);
	$imageData = base64_decode($imageData);
	$filename = sha1(rand(0,100));
	$filepath = $output_dir.$filename.'.jpg';

	file_put_contents($filepath, $imageData);

	$success = true;
}else if(isset($_FILES["file"]))
{
    //Filter the file types , if you want.
    if ($_FILES["file"]["error"] > 0)
    {
      $error = $_FILES["file"]["error"];
    }
    else
    {
    	$filename = sha1($_FILES["file"]["name"].rand(0,100));
		$filesize = getimagesize($_FILES["file"]["tmp_name"]);
		//
		switch ($filesize['mime']) {
			case "image/gif" :
				$filetype = 'gif';
				break;
			case "image/png" :
				$filetype = 'png';
			case "image/jpeg" :
			default :
				$filetype = 'jpg';
		}
		$filepath = $output_dir ."$filename.$filetype";
		//move the uploaded file to uploads folder;
		move_uploaded_file($_FILES["file"]["tmp_name"], $filepath);


		switch($filesize['mime']){
			case "image/gif" :
			case "image/jpeg" :
        	case "image/png" :

        	$response['mimetype'] = $filesize['mime'];
        	$response['width'] = $filesize[0];
        	$response['height'] = $filesize[1];
        	
        	$success = true;
        	break;
        	default :
        	$error = 'mauvais type de fichier. uniquement les images sont autorisées (jpeg/gif/png)';
        	unlink($filepath);
        	break;
        }
        //
 
    }
 
}else{
	$error = 'fichier non selectionné';
}

header('Cache-Control: no-cache, must-revalidate');
header('Content-type: application/json');

if($error){
	$response['error'] = $error;
}else if($success){
	$response['success'] = true;
	$response['filename'] = $filename;
	$response['filepath'] = $filepath;
}
echo json_encode($response);

?>