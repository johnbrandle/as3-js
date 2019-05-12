
# as3-js

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger) [![Dependency Status](https://david-dm.org/dwyl/esta.svg)](https://david-dm.org/dwyl/esta) [![Known Vulnerabilities](https://snyk.io/test/github/dwyl/hapi-auth-jwt2/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dwyl/hapi-auth-jwt2?targetFile=package.json) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

as3-js is an ActionScript 3 to JavaScript compiler, with both browser and Node.js support.

  - IE11, Edge, Chrome, Firefox, Safari (iOS9+)
  - Node.js 10.15.3+

# Supports:

  - Run-time compilation
  - [SWC files][swc]
  - flash.* API
  - XML, XMLList, Proxy, Dictionary, and E4X* (*see docs*)
  - Almost all AS3 language features

# Does not support:
  - [with][with]
  - package-level static initializers (class-level supported)
  - lazy initialization of non-static property values:
```actionscript3
private var foo1:* = foo2; //undefined, not 5
private var foo2:* = 5;
```
  - weak references
  - named closures in conditionals:
 ```actionscript3
if (false) function foo() {} //compilation error
```
  - non-unique custom namespace identifiers:
 ```actionscript3
public var myNamespace;
namespace myNamespace = 'foo'; //conflict
```

# Install:
```bash
npm install @johnbrandle/as3-js
```

# Basic Usage:

##### Browser
```actionscript3
/* c:/projects/hello/source/com/foo/Hello.as */

package com.foo
{
    public class Hello
    {
        public function say():String
        {
            return document.getElementById('hello_world').innerHTML;
        }
    }
}
```

```javascript
/* node compilation script */

const as3_js = require('@johnbrandle/as3-js');

let props =
{
	srcDir:'c:/projects/hello/source', //where *.as files are located
	mainFile:'/com/foo/Hello.as', //main class file relative location to srcDir
	expose:'hello', //what variable name to set main class instance to
	platform:'browser' //environment where compiled js will run, options: "node|browser|player"
}

let result = as3_js.compile(props);

fs.writeFileSync('c:/projects/hello/build/js/hello.js', result.js, 'utf8');
```

```html
<!-- c:/projects/hello/build/index.html -->

<div id="hello_world">hello world</div>

<script src="js/hello.js"></script>
<script>
    trace(hello.say()); //outputs hello world to console
</script>  
```
##### Browser (Runtime)
```html
<script src="node_modules/@johnbrandle/as3-js/_excluded/_generated/as3_js.browser.3.js"></script>
<script>
    let request = new XMLHttpRequest();
    request.open('GET', 'node_modules/@johnbrandle/as3-js/_excluded/_generated/builtin.browser.swc', false); //recommend changing this to asynch
    request.send(null);

    let constructs = as3_js.getSwcUtil().parseSWCString(request.responseText); //recommend caching result

    let script = 'trace("hello world");';
    let code = 'package { public function actionScript(scope:Object, args:*):* { return (function() {' + script + '\n\n}).apply(scope, args || []); } }';  

    let construct = as3_js.getAnalyzer().analyze(as3_js.getParser().parse(as3_js.getLexer().lex(code).tokens), constructs, 3, true, true);  
    let result = as3_js.getTranslator().translate(construct, constructs, true, false, false);  

    let value = '(function() { var $window = this; var window = $window.parent || $window; var document = window.document; var $es4 = window.$es4 || (window.$es4 = {}); var _ = window._; var $ = window.$;\n\n' + result + '\n\n})();';  

    eval(value); //outputs hello world to console
</script>
```
##### Node


```actionscript3
/* c:/projects/hello/source/com/foo/Hello.as */

package com.foo
{
    public class Hello
    {
        public function say():String
        {
            const os = require('os');

            return os.platform() == 'aix' ? global.Buffer.from('hello world').toString() : 'hello world';
        }
    }
}
```

```javascript
/* node compilation script */

const as3_js = require('@johnbrandle/as3-js');

let props =
{
	srcDir:'c:/projects/hello/source', //where *.as files are located
	mainFile:'/com/foo/Hello.as', //main class file relative location to srcDir
	expose:'hello', //module export name
	platform:'node' //environment where compiled js will run, options: "node|browser|player"
}

let result = as3_js.compile(props);

fs.writeFileSync('c:/projects/hello/tools/modules/hello/index.js', result.js, 'utf8');
```

```javascript
/* node test module script */

const hello = require('./modules/hello');

trace(hello.say()); //outputs hello world to console
```

# Advanced Usage:

*see docs*

# Notes:

* For the "browser" platform, recommend loading compiled js files in an iframe *(see docs for details)*
* The original purpose of this project was to convert *valid* AS3 to JS, so consider first compiling with Apache Flex for improved error checking.
* Outstanding bug: missing semicolons will cause compilation errors in some instances...recommend always using semicolons for now.
* Recommended IDE: [IntelliJ][intellij]

   [swc]: <https://en.wikipedia.org/wiki/Adobe_SWC_file>
   [with]: <https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/statements.html#with>
   [intellij]: <https://www.jetbrains.com/idea/>
