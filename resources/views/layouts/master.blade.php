<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title')</title>
        <!-- css -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700|Oswald:400,300|Holtwood+One+SC|Ultra" rel="stylesheet" type="text/css">
        <!-- for both CSS and JS, include a query string of file last modified time, for cache-busting -->
        <!-- using the fully qualified URL results in a file not found error, so had to use base_path() -->
        <!-- see Shouvik's answer, #6 at this time: -->
        <!-- https://stackoverflow.com/questions/118884/how-to-force-browser-to-reload-cached-css-js-files -->
        <link href="/assets/dist/css/style.min.css?v=<?php echo filemtime(base_path('public/assets/dist/css/style.min.css')) ?>" type="text/css" rel="stylesheet">
    </head>
    <body ng-app="qcApp">
        @yield('content')
        <!-- javascript -->
        <!-- include last modified time of js file for angular directive template cache-busting (html files loaded separately) -->
        <div class="hidden qc-last-modified-js"><?php echo filemtime(base_path('/public/assets/dist/js/scripts.min.js')) ?></div>
        <!-- load mathjax separately from CDN, as the bower package wasn't cooperating with minification -->
        <script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML">
        </script>
        <!-- app js -->
        <script type="text/javascript" src="/assets/dist/js/scripts.min.js?v=<?php echo filemtime(base_path('/public/assets/dist/js/scripts.min.js')) ?>"></script>
    </body>
</html>