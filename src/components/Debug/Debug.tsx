import React from "react";
import { DebugProps } from "./Debug.types";

const Debug = ({
  isTouchInteracting,
  trackTranslateXValue,
  slidesTabIndex,
  currentNumberOfVisibleSlides,
  trackTransition,
  mediaQueryCssStyles,
  transformValue,
  className,
  itemClassName,
  initialIndex,
  infinite,
  loop,
  onChangeSlide,
  fallback,
  numVisibleSlides,
  locale,
  autoFocus,
  responsive,
  transitionDuration,
  currentSlide,
  direction,
}: DebugProps) => {
  return (
    <footer className="debug-mode" data-testid="debug-mode-panel">
      <h2>Debug mode</h2>
      <div className="inner">
        <div className="debug-box">
          <h3>State</h3>
          <pre>
            {JSON.stringify(
              {
                isTouchInteracting,
                // translations,
                trackTranslateXValue,
                slidesTabIndex,
                currentNumberOfVisibleSlides,
                trackTransition,
                mediaQueryCssStyles,
                direction,
              },
              null,
              2
            )}
          </pre>
        </div>
        <div className="debug-box">
          <h3>Computed</h3>
          <pre>
            {JSON.stringify(
              {
                transformValue,
              },
              null,
              2
            )}
          </pre>
        </div>
        <div className="debug-box">
          <h3>Props</h3>
          <pre>
            {JSON.stringify(
              {
                className,
                itemClassName,
                initialIndex,
                infinite, // TODO: infinite carousel
                loop,
                onChangeSlide,
                fallback,
                numVisibleSlides,
                locale,
                autoFocus,
                responsive,
                transitionDuration,
              },
              null,
              2
            )}
          </pre>
        </div>
        <div className="debug-box">
          <h3>Current slide</h3>
          <pre>
            {JSON.stringify(
              {
                ...currentSlide,
                element: undefined,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </footer>
  );
};

export default Debug;
