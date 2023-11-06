# query-lazy

![header](./demo/img/jquery-lazy.png)

A simple jQuery plugin to load elements only when they are needed during scrolling.

## Introduction

Set the attribute `[data-lazy-src]` to an image so that the plugin knows which image should be loaded. It can also be set to other elements to load the background image for the parent element.  
If the `[data-lazy-url]` attribute is set to an element, the content is fetched using ajax.

Make sure that the elements that are loaded via the plugin have a minimum height; 
otherwise it can happen that all elements are loaded at once.  
For example like this:
```css
 .lazy-waiting {
    display: block;
    visibility: hidden;
    min-height: 300px;
}
```

The plugin provides you with 3 classes to handle this.

1. `lazy-waiting` This class receives every element that is initialized via the plugin.
2. `lazy-loading` This class is assigned to each element via which the plugin is requested to load.
3. `lazy-done` This class is set on every element that has finished loading.

Another example:
```css
body.lazy-done {
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
```

## Installation
1. Download the plugin [uncompressed](./dist/jquery-lazy.js), [minified](./dist/jquery-lazy.min.js)
2. Load the plugin via composer 
```shell
composer require webcito/query-lazy:dev-main
```
3. Include the plugin in your project at the end of the body tag. Make sure that jQuery is loaded first.
```html
<script src="./vendor/components/jquery/jquery.min.js"></script>
<script src="./dist/jquery-lazy.min.js"></script>
```
## Usage
Set the attribute `[data-lazy-{src,url}]` to all elements that should be loaded lazy.
```html
<div data-lazy-src="path/to/img.file">
    <img data-lazy-src="path/to/img.file"  src="" alt=""/>
    <div data-lazy-url="./demo/content.html"></div>
</div>
```
Initialize the plugin
```js
$('[data-lazy-src], [data-lazy-url]').lazy({
    classWaiting: 'lazy-waiting',
    classLoading: 'lazy-loading',
    classDone: 'lazy-done',
    onBeforeLoad(element) {},
    onLoad(element, w, h, y, x) {},
    onError(element) {},
    onCompleted() {}
});
```
