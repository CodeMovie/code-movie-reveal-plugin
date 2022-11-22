# [Code.Movie](https://code.movie) plugin for [reveal.js](https://revealjs.com/)

Integrate animated, syntax highlighted code from [Code.Movie](https://code.movie) into your reveal.js presentations!

## What this does

This plugin makes Reveal.js handle each animation keyframe like a fragment. You can navigate through an animated code sample using arrow keys or a remote, just like you would navigate through slides or regular fragments.

## How to use

First create a Reveal.js slide deck and import the plugin [just like any other reveal.js plugin](https://revealjs.com/plugins/). You can either grab the plugin straight from the `dist` directory on GitHub (both minified script and minified ESM modules are available) or install the plugin from NPM.

```html
```

Then either export your Code.Movie project to HTML or get an embed code. Add the exported HTML or the embed code to a slide:

```html
<!-- A slide with the HTML export of a Code.Movie project -->

<!-- A slide with a Code.Movie embed code -->
```

And that's basically it! You can tweak details like the font size by setting the appropriate attributes on either the `<code-movie-runtime>` element or the `<script>` element containing the runtime code.

```html
<!-- Setting the font size on an HTML export -->

<!-- Setting the font size using an embed code -->
```

The plugin bundles the `<code-movie-runtime>` element, so everything should work out of the box.

## How this works

This plugin adds an invisible fragment for each keyframe or each `<code-movie-runtime>` in the presentation and performs a bit of event handling to tie the animation's state to the current fragment. It is extremely simple and basic.
