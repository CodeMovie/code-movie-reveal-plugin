import "@codemovie/code-movie-runtime";

// For every non-0-frame, add a fragment directly after the animation element.
// Fragment events ensure that, when one of the fragments becomes visible, the
// animation gets moved to the corresponding frame.
function augmentAnimation(animation) {
  for (let i = 0; i < animation.maxFrame; i++) {
    const fragment = document.createElement("span");
    fragment.className = `fragment animation-plugin-fragment`;
    animation.after(fragment);
  }
}

// Augment all the animations in a given slide with fragments
function augmentSlide(slide, deck) {
  const animations = slide.querySelectorAll("code-movie-runtime");
  for (const animation of animations) {
    augmentAnimation(animation, deck);
    deck.syncFragments();
  }
}

// Traverses the DOM looking for an animation element and counts the number of
// already-visible fragments on the way to figure out the frame index.
function getAnimationTargetForFragment(fragment, index) {
  if (!fragment) {
    return null;
  }
  if (fragment.matches(".animation-plugin-fragment")) {
    return getAnimationTargetForFragment(
      fragment.previousElementSibling,
      index + 1
    );
  }
  if (fragment.matches("code-movie-runtime")) {
    return [fragment, index];
  }
  return null;
}

// For plugin for ESM users
export function CodeMovie() {
  return {
    id: "code-movie",
    init: (deck) => {
      // Augment all slides with animations on init (and after the runtime
      // element has been registered) by adding extra fragments to each runtime
      // element.
      deck.on("ready", async () => {
        await window.customElements.whenDefined("code-movie-runtime");
        for (const slide of deck.getSlides()) {
          augmentSlide(slide, deck);
        }
      });
      // Intercepts fragment events and update the corresponding animation's
      // current frame depending on which fragment just became visible or
      // invisible.
      deck.on("fragmentshown", (evt) => {
        const target = getAnimationTargetForFragment(evt.fragment, 0);
        if (!target) {
          return;
        }
        const [animation, index] = target;
        animation.current = index;
      });
      deck.on("fragmenthidden", (evt) => {
        const target = getAnimationTargetForFragment(evt.fragment, -1);
        if (!target) {
          return;
        }
        const [animation, index] = target;
        animation.current = index;
      });
    },
  };
}

// Expose plugin as global variable for script users
globalThis.CodeMovie = CodeMovie;
