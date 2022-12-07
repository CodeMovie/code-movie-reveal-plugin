import "@codemovie/code-movie-runtime";

// Associates fragments with "their" animation elements to make teardown logic
// possible.
const fragmentMap = new WeakMap();

// For every non-0-frame, add a fragment directly after the animation element.
// Fragment events ensure that, when one of the fragments becomes visible, the
// animation gets moved to the corresponding frame.
function augmentAnimation(animation) {
  const fragmentList = [];
  for (let i = 0; i < animation.maxFrame; i++) {
    const fragment = document.createElement("span");
    fragment.className = `fragment code-movie-plugin-fragment`;
    animation.after(fragment);
    fragmentList.push(fragment);
  }
  fragmentMap.set(animation, fragmentList);
}

// Augment all the animations in a given slide with fragments
function augmentSlide(slide, deck) {
  const animations = slide.querySelectorAll("code-movie-runtime");
  for (const animation of animations) {
    augmentAnimation(animation);
    deck.syncFragments();
  }
}

// Traverses the DOM looking for an animation element and counts the number of
// already-visible fragments on the way to figure out the frame index.
function getAnimationTargetForFragment(fragment, index) {
  if (!fragment) {
    return null;
  }
  if (fragment.matches(".code-movie-plugin-fragment")) {
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

// Augment animations that are added after init (eg. by slowly-loading embed
// codes) and, while we are at it, also add cleanup logic that removes fragments
// when "their" respective animation goes away.
function observeAnimationAdditionsAndRemovals(deck) {
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "childList") {
        for (const addedNode of record.addedNodes) {
          if (
            addedNode.nodeType === 1 &&
            addedNode.matches("code-movie-runtime")
          ) {
            augmentAnimation(addedNode);
            deck.syncFragments();
          }
        }
        for (const removedNode of record.removedNodes) {
          if (
            removedNode.nodeType === 1 &&
            removedNode.matches("code-movie-runtime")
          ) {
            const fragments = fragmentMap.get(removedNode) ?? [];
            for (const fragment of fragments) {
              fragment.remove();
            }
            deck.syncFragments();
          }
        }
      }
    }
  }).observe(document.querySelector(".slides"), {
    subtree: true,
    childList: true,
  });
}

// Expose the plugin function for ESM users
export function CodeMovie() {
  return {
    id: "code-movie",
    init: (deck) => {
      // Augment all slides with existing animations on init (and after the
      // runtime element has been registered) by adding extra fragments to each
      // runtime element. Afterwards, start an observer that augments newly
      // added animations and handles the teardown for removed animations.
      deck.on("ready", async () => {
        await window.customElements.whenDefined("code-movie-runtime");
        for (const slide of deck.getSlides()) {
          augmentSlide(slide, deck);
        }
        observeAnimationAdditionsAndRemovals(deck);
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
