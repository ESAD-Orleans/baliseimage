<?php
//upload.php
$output_dir = "files/";

$files = scandir($output_dir);
$only_jpg = "(([abcdef0-9]{40}).jpg)";

$readyToDraw = array();
$readyToBeSend = array();

foreach ($files as $file) {
	$jpeg = preg_match($only_jpg,$file) ? $file : false;
	if($jpeg){
		$id = str_split($jpeg, 40)[0];
		$json = __DIR__.'/'. $output_dir . $id . '.json';
		$json_exist = file_exists($json);
		if(!$json_exist){
			array_push($readyToDraw,array('id'=>$id));
		}else{
			array_push($readyToBeSend, array('id' => $id));
		}
	}
}

if($_GET['admin']){
	echo json_encode($readyToBeSend);
}else{
	echo json_encode($readyToDraw);
}

?>