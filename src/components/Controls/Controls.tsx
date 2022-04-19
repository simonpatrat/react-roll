import React, { useCallback } from "react";

import ControlButton from "../ControlButton";
import { getTranslation } from "../../lib/translations";
import { ControlsProps } from "./Controls.types";

const Controls = ({
  currentSlide,
  controlButtonType,
  goToPrevious,
  goToNext,
  locale,
  mergedTranslations,
  loop,
  hasReachedLastSlide,
  infinite,
}: ControlsProps) => {
  const handleClickNext = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const handleClickPrevious = useCallback(() => {
    goToPrevious();
  }, [goToPrevious]);
  return (
    <div className="r-r__controls">
      {currentSlide?.index > 0 || loop || infinite ? (
        <ControlButton
          buttonType={controlButtonType}
          direction="previous"
          onClick={handleClickPrevious}
          label={getTranslation(
            locale,
            "controls.buttons.previous.label",
            mergedTranslations
          )}
          ariaLabel={getTranslation(
            locale,
            "controls.buttons.previous.ariaLabel",
            mergedTranslations
          )}
        />
      ) : null}
      {loop || infinite || !hasReachedLastSlide ? (
        <ControlButton
          buttonType={controlButtonType}
          direction="next"
          onClick={handleClickNext}
          label={getTranslation(
            locale,
            "controls.buttons.next.label",
            mergedTranslations
          )}
          ariaLabel={getTranslation(
            locale,
            "controls.buttons.next.ariaLabel",
            mergedTranslations
          )}
        />
      ) : null}
    </div>
  );
};

export default Controls;
