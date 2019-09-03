<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title')</title>
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700|Oswald:400,300|Holtwood+One+SC|Ultra" rel="stylesheet" type="text/css">
        <base href="/">
    </head>
    <body>
        @yield('content')
        <!-- javascript -->
        <!-- load mathjax separately from CDN, as the bower package wasn't cooperating with minification -->
        <script type="text/javascript" async src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML">
        </script>
        <!-- app js -->
        <script src="/assets/dist/polyfills-es5.js" nomodule defer></script><script src="/assets/dist/polyfills-es2015.js" type="module"></script><script src="/assets/dist/styles-es2015.js" type="module"></script><script src="/assets/dist/styles-es5.js" nomodule defer></script><script src="/assets/dist/runtime-es2015.js" type="module"></script><script src="/assets/dist/vendor-es2015.js" type="module"></script><script src="/assets/dist/main-es2015.js" type="module"></script><script src="/assets/dist/runtime-es5.js" nomodule defer></script><script src="/assets/dist/vendor-es5.js" nomodule defer></script><script src="/assets/dist/main-es5.js" nomodule defer></script>
    </body>
</html>