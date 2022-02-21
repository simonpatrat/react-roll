import React, { useCallback, useEffect, useRef, memo } from "react";

import { cls } from "../../lib/utils";
import { usePrevious } from "../../lib/usePrevious";
import {
  CAROUSEL_SLIDE_CLASSNAME,
  CAROUSEL_ACTIVE_SLIDE_CLASSNAME,
} from "../../lib/constants";

import { SlideProps } from "./Slide.types";

const Slide = memo(
  ({
    id,
    className,
    isActive,
    index,
    children,
    onLoad,
    width,
    autoFocus,
    carouselTrackRef,
    debugMode = false,
    slidePadding = "0",
    tabIndex = 0,
    pointerEvents,
  }: SlideProps) => {
    const slideRef = useRef<HTMLDivElement>(null);
    const previousIsActive = usePrevious(isActive);

    useEffect(() => {
      if (slideRef?.current && onLoad) {
        onLoad(slideRef.current, {
          id,
          isActive,
          index,
          width,
        });
      }
    }, [slideRef, onLoad, id, isActive, index, width]);

    const applyAutoFocus = useCallback(
      (event) => {
        const { srcElement, propertyName } = event;
        // Here to prevent autofocus bugs when something transitions inside of carousel track
        // we are tracking only "transform" property transition and only for carousel track element
        const isCarouselTrackTransitionend =
          srcElement === carouselTrackRef.current &&
          propertyName === "transform";
        if (
          slideRef.current &&
          isCarouselTrackTransitionend &&
          tabIndex === 0
        ) {
          // debugger;
          slideRef.current.focus();
        }
      },
      [slideRef, carouselTrackRef, tabIndex]
    );

    useEffect(() => {
      const currentCarousel = carouselTrackRef?.current;
      if (
        currentCarousel &&
        autoFocus &&
        slideRef.current &&
        !previousIsActive &&
        isActive
      ) {
        currentCarousel.addEventListener("transitionend", applyAutoFocus);
      }
      return () => {
        currentCarousel?.removeEventListener("transitionend", applyAutoFocus);
      };
    }, [
      autoFocus,
      carouselTrackRef,
      applyAutoFocus,
      previousIsActive,
      isActive,
      slideRef,
    ]);

    return (
      <div
        ref={slideRef}
        data-id={id}
        data-index={index}
        role="group"
        aria-label={`slide ${index + 1}`}
        tabIndex={tabIndex}
        aria-hidden={!isActive}
        className={cls([
          CAROUSEL_SLIDE_CLASSNAME,
          !!className && className,
          isActive ? CAROUSEL_ACTIVE_SLIDE_CLASSNAME : false,
        ])}
        style={{
          width: `${width}%`,
          padding: slidePadding,
          pointerEvents,
          userSelect: pointerEvents,
        }}
        {...(onLoad && onLoad)}
      >
        {children}
      </div>
    );
  }
);

export default Slide;
