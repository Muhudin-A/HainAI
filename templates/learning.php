<?php
// Load data from CSV file
function load_data($filename) {
    $data = array();
    if (($file = fopen($filename, 'r')) !== false) {
        $header = fgetcsv($file);
        while (($row = fgetcsv($file)) !== false) {
            $data[] = array_combine($header, $row);
        }
        fclose($file);
    }
    return $data;
}

// Get the explanation based on the topic and dyslexia level
function get_explanation($data, $topic, $dyslexia_level) {
    foreach ($data as $row) {
        if (strtolower($row['Topic']) == strtolower($topic) && strtolower($row['Dyslexia_Level']) == strtolower($dyslexia_level)) {
            return $row;
        }
    }
    return null;
}

// Get the user input from the form (AJAX)
if (isset($_POST['topic']) && isset($_POST['dyslexia_level'])) {
    $topic = $_POST['topic'];
    $dyslexia_level = $_POST['dyslexia_level'];

    // Load the data
    $data = load_data('dyslexia_data.csv');

    // Get the explanation
    $response = get_explanation($data, $topic, $dyslexia_level);

    // Return the response as JSON
    if ($response) {
        echo json_encode(array(
            'explanation' => $response['Explanation'],
            'example' => $response['Example'],
            'media_aids' => $response['Media_Aids'],
            'adaptive_response' => $response['Adaptive_Response']
        ));
    } else {
        echo json_encode(array('error' => 'No data available for the selected topic and dyslexia level.'));
    }
}
?>
