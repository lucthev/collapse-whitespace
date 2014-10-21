# collapse-whitespace

`collapse-whitespace` is a module for removing unnecessary whitespace from a DOM tree.

## Installation

Using [`npm`](https://www.npmjs.org/):

```
$ npm install collapse-whitespace
```

If you’re using [`browserify`](https://github.com/substack/node-browserify) or something similar:

```js
var collapse = require('collapse-whitespace')
```

Otherwise, just include the bundled file, `whitespace.min.js`, somewhere on your page:

```html
<script src="./node_modules/collapse-whitespace/whitespace.min.js"></script>
```

## Usage

`collapse-whitespace` exposes a single function (called `collapse`, if you’re including this module as a global), which takes a DOM node as its only parameter and returns nothing of significance. `collapse-whitespace` will reduce all whitespace in that node to a minimum; see [here](https://github.com/lucthev/collapse-whitespace/blob/master/test.html) for some examples.

### Important things to keep in mind:

1. `collapse-whitespace` will almost certainly make modifications to the given node; these may include joining adjacent text nodes, removing whitespace from text nodes, and even removing text nodes entirely if they contain only whitespace. Whitespace, if you’re curious, is those characters that match the RegExp `/ \t\r\n/`.

2. `collapse-whitespace` does not take into account the parent(s) of the given node. For example,

    ```html
    <pre>
        <span class="test">
            Lots of whitespace around this text.
        </span>
    </pre>
    <script>
        collapse(document.querySelector('.test'))
    </script>
    <!-- Results in: -->
    <pre>
        <span class="test">Lots of whitespace around this text.</span>
    </pre>
    ```

    This will almost certainly result in a visually different representation of that text — unless you’ve applied CSS `whitespace: pre` to the parent `pre`, which bring us to the next point:

3. `collapse-whitespace` does not pay attention to CSS styles, even `style` attributes. Instead, it relies on a theoretical [list](https://github.com/lucthev/collapse-whitespace/blob/master/whitespace.js#L3-L24) of block elements, and assumes that only `pre` elements have `whitespace: pre`. So, if you’re doing something like:

    ```html
    <style>
        .test {
            white-space: pre;
        }
    </style>
    <div class="test">
        I am indented
        text.
    </div>
    <script>
        collapse(document.querySelector('.test'))
    </script>
    <!-- Results in: -->
    <div class="test">I am indented text.</div>
    ```

    That text will no longer be indented. I have no plans to support checking the computed style, although, if that’s important to you, I would encourage you to fork this project; there should only be a few changes to make, which I’ll be happy to guide you through if need be (opening [an issue](https://github.com/lucthev/collapse-whitespace/issues/new?title=Hi) is probably the easiest way to get in touch).

## License

MIT.
