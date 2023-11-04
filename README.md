# query-lazy

A simple jQuery plugin to load elements only when they are needed during scrolling.

Set the attribute data-src to an image so that the plugin knows which image should be loaded. It can also be set to other elements to load the background image for the parent element.

**Prepare elements for the lazy loader.**
```html
 <img alt="" data-lazy-src="https://cdn.pixabay.com/photo/2016/11/22/23/12/beach-1851101_960_720.jpg"  src=""/>
```
**Load the lazy loader at the end of the body tag**
```html
<script src="/vendor/components/jquery/jquery.min.js"></script>
<script src="/dist/jquery-lazy.min.js"></script>
```

**Initialize the lazy loader**
```js
$('[data-src]').lazy();
```
