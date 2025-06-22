# jQuery-lazy

![header](./demo/img/jquery-lazy.png)

A simple jQuery plugin to load elements only when they are needed during scrolling.

## Introduction

Set the attribute `[data-lazy-src]` to an image so that the plugin knows which image should be loaded. It can also be
set to other elements to load the background image for the parent element.  
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

The plugin provides you with 4 classes to handle this.

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
2. Or load the plugin via composer

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
    <img data-lazy-src="path/to/img.file" src="" alt=""/>
    <div data-lazy-url="./demo/content.html"></div>
</div>
```

Initialize the plugin

```js
$('[data-lazy-src], [data-lazy-url]').lazy(options);
```

## Options

| name         | type       | default                                            | description                                                                                                                             |
|--------------|------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| recursive    | `bool`     | `true`                                             | If the value is `true`, additional lazy elements are searched for and initialized in elements that are loaded via ajax (data-lazy-url). |
| classStatic  | `string`   | `'lazy'`                                           | The class is set for each element and is not changed further.                                                                           |
| classWaiting | `string`   | `'lazy-waiting'`                                   | This class receives every element that is initialized via the plugin.                                                                   |
| classLoading | `string`   | `'lazy-loading'`                                   | This class is assigned to each element via which the plugin is requested to load.                                                       |
| classDone    | `string`   | `'lazy-done'`                                      | This class is set on every element that has finished loading.                                                                           |
| onBeforeLoad | `function` | `(element) => {}`                                  | The function is triggered before an element receives its content.                                                                       |
| onLoad       | `function` | `(element, width, height, scrollY, scrollX) => {}` | The function is triggered when an element has received its content.                                                                     |
| onError      | `function` | `(element) => {}`                                  | The function is triggered if an element could not receive its content.                                                                  |
| onCompleted  | `function` | `() => {}`                                         | The function is triggered once all elements have received their content.                                                                |

## Events

| name              | params                             | description                                   |
|-------------------|------------------------------------|-----------------------------------------------|
| `beforeLoad.lazy` | e                                  | Fires on every element before it is loaded    |
| `loaded.lazy`     | e, width, height, scrollY, scrollX | Fires on any element after it has been loaded |

## Further information

After an element has been loaded, the attributes `data-lazy-src` and `data-lazy-url` are removed from the element.