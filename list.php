<?php
//upload.php
$output_dir = "files/";


$files = scandir($output_dir);
$only_jpg = "(([abcdef0-9]{40}).jpg)";

function RegisterNewJSON($id)
{

	global $output_dir;

	$json = array(
		'id' => $id,
		'model-id' => $id,
		'image' => $output_dir . "$id.jpg",
		'date' => time(),
		'iteration' => 0
	);
	file_put_contents($output_dir . "$id.json", json_encode($json));

	return $json;

}
$readyToDraw = array();
$readyToBeSend = array();

foreach ($files as $file) {
	$jpeg = preg_match($only_jpg,$file) ? $file : false;
	if($jpeg){
		$split = str_split($jpeg, 40);
		$id = $split[0];
		$json = __DIR__.'/'. $output_dir . $id . '.json';
		$json_exist = file_exists($json);
		//
		if(!$json_exist){
			$jsonDecode = RegisterNewJSON($id);
		}else{
			$jsonString = file_get_contents($json);
			$jsonDecode = json_decode($jsonString);
			$jsonDecode->id=$id;
		}
		array_push($readyToBeSend, $jsonDecode);
		$i = intval($jsonDecode->iteration);
		if($i<=5 && ($jsonDecode->gallery =="1")){
			array_push($readyToDraw, $jsonDecode);
		}
	}
}

header('Content-type: application/json');

if($_GET['password']){
	if($_GET['password']=='arcenf2015'){
		echo json_encode($readyToBeSend);
	}else{
		header('HTTP/1.1 403 Forbidden');
		header('Status: 403 Forbidden');
		echo json_encode(array('error'=>'403 Forbidden'));
	}
}else{
	echo json_encode($readyToDraw);
}

?>