<!---
layout: intro
title: Moui 
-->

# Moui

> * OO-based UI behavior modules behind [CardKit](http://ozjs.org/CardKit/)'s view components
> * 'mobile first'
> * Independent of particular appearance and specific business
> * Use HTML as configurations that is equal to JS API

## Usage

### AMD and OzJS

* Moui can either be viewed as an independent library, or as a part of [OzJS mirco-framework](http://ozjs.org/#framework).
* It's wrapped as an [AMD (Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/wiki/AMD) module. You should use it with [oz.js](http://ozjs.org/#start) (or require.js or [similar](http://wiki.commonjs.org/wiki/Implementations) for handling dependencies). 
* If you want to make it available for both other AMD code and traditional code based on global namespace. OzJS provides [a mini define/require implementation](http://ozjs.org/examples/adapter/) to transform AMD module into traditional [module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth).
* See [http://ozjs.org](http://ozjs.org) for details.

### Get the code

* [Download on Github](https://github.com/dexteryy/moui/)
* Add to your project as new dependency:
    * via [istatic](http://ozjs.org/istatic)
    * via [volo](https://github.com/volojs/volo)

## Dependencies

* [mo](https://github.com/dexteryy/mo)
* [dollar](https://github.com/dexteryy/DollarJS) or other jQuery-compatible library

## Examples

[CardKit demo app](http://ozjs.org/CardKit/refapp)

## Modules Overview

* [moui/control](https://github.com/dexteryy/moui/blob/master/control.js): 
    * Minimal stateful component
* [moui/picker](https://github.com/dexteryy/moui/blob/master/picker.js): 
    * Compose of `Control` objects
* [moui/overlay](https://github.com/dexteryy/moui/blob/master/overlay.js): 
    * Minimal overlay component
* [moui/actionview](https://github.com/dexteryy/moui/blob/master/actionview.js): 
    * Inherit from `Overlay`
    * Compose of `Picker` objects
* [moui/modalview](https://github.com/dexteryy/moui/blob/master/modalview.js): 
    * Inherit from `Overlay`
* `moui/imageview` (Comming soon)
    * Inherit from `ModalView`
* [moui/growl](https://github.com/dexteryy/moui/blob/master/growl.js): 
    * Inherit from `Overlay`
* `moui/bubble` (Plan to refactor)
    * Inherit from `Growl`
* [moui/ranger](https://github.com/dexteryy/moui/blob/master/ranger.js): 
    * Minimal range component
* `moui/slider` (Plan to refactor)
    * Inherit from `Ranger`
* [moui/util/stick](https://github.com/dexteryy/moui/blob/master/util/stick.js): 
    * Stick a DOM element to anther from any clock position 

> * Under construction...

## API and usage

Comming soon...

## More References

See [OzJS Project Homepage](http://ozjs.org/)

## Release History

See [OzJS Release History](http://ozjs.org/#release)

## License

Copyright (c) 2010 - 2013 dexteryy  
Licensed under the MIT license.


