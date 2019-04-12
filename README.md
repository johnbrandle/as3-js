# as3-js

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger) [![Dependency Status](https://david-dm.org/dwyl/esta.svg)](https://david-dm.org/dwyl/esta) [![Known Vulnerabilities](https://snyk.io/test/github/dwyl/hapi-auth-jwt2/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dwyl/hapi-auth-jwt2?targetFile=package.json) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

as3-js is an ActionScript 3 to JavaScript compiler, with both browser and Node.js support.

  - IE11+, Chrome, Firefox, Safari (iOS9+)
  - Node.js 10.15.3+

# Supports:

  - Run-time compilation
  - [SWC files][swc]
  - flash.* API
  - XML, XMLList, Proxy, Dictionary, and E4X (*see notes*)
  - Almost all ActionScript 3 language features

### Usage

##### basic

*todo*

##### detailed

*todo*


Does not support:
  - [with][with]
  - package-level static initializers (class-level supported)
  - lazy initialization of non-static property values:
```actionscript
        private var foo1:* = foo2; //undefined, not 5
        private var foo2:* = 5;
```
  - weak references
  - named closures in conditional statements
 ```actionscript
        if (false) function foo() {} //compilation error
```
  - non-unique custom namespace identifiers
 ```actionscript
        public var myNamespace; 
        namespace myNamespace = 'foo'; //conflict
```


### Notes

todo


   [swc]: <https://en.wikipedia.org/wiki/Adobe_SWC_file>
   [with]: with