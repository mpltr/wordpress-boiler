<?php
// Finds function and class files to include using fn_ and cl_ prefix
function recursive_scandir($dir) {
    $result = [];
    foreach(scandir($dir) as $filename) {
        if ($filename[0] === '.') continue;
        $filePath = $dir . '/' . $filename;
        if (is_dir($filePath)) {
            foreach (recursive_scandir($filePath) as $childFilename) {
                $result[] = $filename . '/' . $childFilename;
            }
        } else {
            $result[] = $filename;
        }
    }
    return $result;
}
// Setup array for included function and class files
$includes = [];
// find function and class files and add to includes
$functions_files = recursive_scandir(get_template_directory());
foreach ($functions_files as $file) {
    if (strpos($file, 'fn_') !== false || strpos($file, 'cl_') !== false) {
        array_push($myracing_includes, $file);
    }
}
// check files and require
foreach($includes as $file) {
    if (!$filepath = locate_template($file)) {
        trigger_error(sprintf(__('Error locating %s for inclusion', 'dev_warning'), $file), E_USER_ERROR);
    }
    require_once $file;
}