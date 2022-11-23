# [Code.Movie](https://code.movie) plugin for [reveal.js](https://revealjs.com/)

Integrate animated, syntax highlighted code from [Code.Movie](https://code.movie)
into your reveal.js presentations!

## What this does

This plugin makes Reveal.js handle each animation keyframe like a fragment. You
can navigate through an animated code sample using arrow keys or a remote, just
like you would navigate through slides or regular fragments.

## How to use

You can install the library as `@codemovie/code-movie-reveal-plugin` from NPM,
[download the latest release from GitHub](https://github.com/CodeMovie/code-movie-reveal-plugin/releases)
or just grab either `index.esm.js` or `index.js`
[from the source code](https://github.com/CodeMovie/code-movie-reveal-plugin/tree/main/dist).

Then create a Reveal.js slide deck and import the plugin [just like any other reveal.js plugin](https://revealjs.com/plugins/):

```html
<!-- Using the plugin as a module -->
<script src="dist/reveal.js"></script>
<script type="module">
  import { CodeMovie } from "./plugin/code-movie/index.esm.js";
  Reveal.initialize({
    hash: true,
    plugins: [CodeMovie]
  });
</script>

<!-- Using the module as a plain script -->
<script src="dist/reveal.js"></script>
<script src="plugin/code-movie/index.esm.js"></script>
<script>
  Reveal.initialize({
    hash: true,
    plugins: [CodeMovie]
  });
</script>
```

Then either export your Code.Movie project to HTML or get an embed code. Add the
exported HTML or the embed code to a slide:

```html
<!-- A slide with the HTML export of a Code.Movie project -->
<section>
  <code-movie-runtime keyframes="0 1 2 3 4 5">
    <!-- Exported HTML content -->
  </code-movie-runtime>
</section>
```

And that's basically it! You can tweak details like the font size by setting the
appropriate attributes on either the `<code-movie-runtime>` element or the
`<script>` element containing the runtime code.

```html
<!-- Setting the font size on an HTML export -->
<section>
  <code-movie-runtime keyframes="0 1 2 3 4 5" style="font-size:0.375em">
    <!-- Exported HTML content -->
  </code-movie-runtime>
</section>
```

The plugin bundles the `<code-movie-runtime>` element, so everything should work
out of the box.

## How this works

This plugin adds an invisible fragment for each keyframe or each
`<code-movie-runtime>` in the presentation and performs a bit of event handling
to tie the animation's state to the current fragment. It is extremely simple and
basic :)
