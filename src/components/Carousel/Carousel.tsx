import React from "react";

import { CarouselProps } from "./Carousel.types";
import CarouselProvider from "../../lib/CarouselContext";
import CarouselUI from "./CarouselUI";

const Carousel: React.FunctionComponent<CarouselProps> = ({
  children,
  className,
  itemClassName,
  initialIndex,
  infinite = false,
  loop = false,
  onChangeSlide,
  numVisibleSlides = 1,
  locale = "fr",
  autoFocus = true,
  responsive,
  transitionDuration = 300,
  fallback, // TODO: FallbackComponent for SSR etc.
  debugMode = false,
  slidePadding,
  translations,
  dots = true,
  dotsStyle = "numbers",
  dotsPosition = "center",
  controlButtonType = "icon",
}) => {
  return (
    <CarouselProvider
      initialChildren={children}
      currentIndex={initialIndex}
      loop={loop}
      infinite={infinite}
      numVisibleSlides={numVisibleSlides}
    >
      <CarouselUI
        className={className}
        itemClassName={itemClassName}
        initialIndex={initialIndex}
        infinite={infinite}
        loop={loop}
        onChangeSlide={onChangeSlide}
        numVisibleSlides={numVisibleSlides}
        locale={locale}
        autoFocus={autoFocus}
        responsive={responsive}
        transitionDuration={transitionDuration}
        fallback={fallback}
        debugMode={debugMode}
        slidePadding={slidePadding}
        translations={translations}
        dots={dots}
        dotsStyle={dotsStyle}
        dotsPosition={dotsPosition}
        controlButtonType={controlButtonType}
      />
    </CarouselProvider>
  );
};

export default Carousel;
