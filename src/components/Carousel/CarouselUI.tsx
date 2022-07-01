import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useContext,
  useCallback,
} from "react";
import "./carousel.scss";

import usePrevious from "../../lib/usePrevious";
import Slide from "../Slide";
import Debug from "../Debug";
import Controls from "../Controls";
import { cls } from "../../lib/utils";

import {
  CAROUSEL_CLASSNAME,
  CAROUSEL_TRACK_CLASSNAME,
  CAROUSEL_CLASSNAME_DEBUG_MODE,
} from "../../lib/constants";
import { defaultTranslationsMessages } from "../../lib/translations";

import {
  CarouselProps,
  CarouselResponsiveProp,
  CarouselResponsivePropRules,
} from "./Carousel.types";

import { CarouselContext } from "../../lib/CarouselContext";
import { SlideItem } from "../../common/types";

const CarouselUI = ({
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
  fullSize,
  withScrollbar,
}: CarouselProps) => {
  const {
    slides,
    currentSlide,
    goTo,
    goToPrevious,
    goToNext,
    lastSlideIndex,
    hasReachedLastSlide,
    direction,
  } = useContext(CarouselContext);

  const didMount = useRef(false);
  const isScrollingTimeout = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const carouselOriginCoordinates = useRef<null | { x: number; y: number }>(
    null
  );
  const lastTranslate = useRef<null | { x: number; y: number }>(null);
  const previousTranslateX = usePrevious(lastTranslate?.current?.x || 0);

  const [trackTranslateXValue, setTrackTranslateXValue] = useState(0);
  const [slidesTabIndex, setSlidesTabIndex] = useState(0);
  const [isTouchInteracting, setIsTouchInteracting] = useState<boolean>(false);
  const [mediaQueryCssStyles, setMediaQueryCssStyles] = useState<
    Partial<CarouselResponsivePropRules>
  >({});

  const [isDragMoving, setIsDragMoving] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isProgrammaticallyScrolling, setIsProgrammaticallyScrolling] =
    useState<boolean>(false);

  const [currentNumberOfVisibleSlides, setCurrentNumberOfVisibleSlides] =
    useState<number>(numVisibleSlides);

  if (slides.length <= 0) {
    return fallback || null;
  }

  const distanceBetweenNextSlideAndCurrent =
    typeof lastSlideIndex !== "undefined" &&
    typeof currentSlide?.index !== "undefined"
      ? Math.abs(currentSlide.index - lastSlideIndex)
      : 0;
  const previousIsTouchInteracting = usePrevious(isTouchInteracting);

  const getTrackTransitionSpeedMs = useCallback(() => {
    if (distanceBetweenNextSlideAndCurrent === 0) {
      return transitionDuration;
    }
    return transitionDuration * distanceBetweenNextSlideAndCurrent >
      transitionDuration * 2
      ? transitionDuration * 2
      : transitionDuration * distanceBetweenNextSlideAndCurrent;
  }, [distanceBetweenNextSlideAndCurrent, transitionDuration]);

  const [trackTransition, setTrackTransition] = useState<string | undefined>(
    "none"
  );

  const enhancedMediaQueryList = useMemo(() => {
    if (!responsive || (responsive && Object.keys(responsive)?.length <= 0)) {
      return null;
    }

    const rssponsiveConfig: CarouselResponsiveProp = {
      9999: {
        numVisibleSlides: numVisibleSlides || 1,
      },
      ...responsive,
    };

    return Object.keys(rssponsiveConfig).map((bp: string, index: number) => {
      const previousBp = Object.keys(rssponsiveConfig)?.[index - 1];
      const previousBpValue = previousBp ? parseInt(previousBp, 10) - 1 : 0;
      return {
        bp,
        rules: rssponsiveConfig[bp],
        mq: window.matchMedia(
          `(min-width: ${previousBpValue}px) and (max-width: ${bp}px)`
        ),
      };
    });
  }, [responsive, numVisibleSlides]);

  const getSlideWidthRatio = useCallback(
    (givenSlides: SlideItem[]) => {
      return givenSlides.length / currentNumberOfVisibleSlides;
    },
    [currentNumberOfVisibleSlides]
  );

  const getTrackTotalWidthPercent = useCallback(
    (givenSlides: SlideItem[]) => {
      const ratio = getSlideWidthRatio(givenSlides);
      return ratio * 100;
    },
    [getSlideWidthRatio]
  );

  const getSlideWidthPercent = (givenSlides: SlideItem[]) => {
    const ratio = getSlideWidthRatio(givenSlides);
    return 100 / currentNumberOfVisibleSlides / ratio;
  };

  const handleMediaQueryChange = useCallback(
    (event, rules: CarouselResponsivePropRules) => {
      if (event.matches) {
        const { numVisibleSlides: nVSLides, ...cssRules } = rules;
        setCurrentNumberOfVisibleSlides(nVSLides);
        setMediaQueryCssStyles({ ...cssRules });
      }
    },
    []
  );

  useEffect(() => {
    setCurrentNumberOfVisibleSlides(numVisibleSlides);
  }, [numVisibleSlides]);

  useEffect(() => {
    if (enhancedMediaQueryList) {
      enhancedMediaQueryList.forEach((el) => {
        const { mq, rules } = el;

        if (mq.matches) {
          const { numVisibleSlides: nVSlides, ...cssRules } = rules;
          setCurrentNumberOfVisibleSlides(nVSlides);
          setMediaQueryCssStyles({ ...cssRules });
        }
        mq.addEventListener("change", (event) =>
          handleMediaQueryChange(event, rules)
        );
      });
    }

    return () => {
      if (enhancedMediaQueryList) {
        enhancedMediaQueryList.forEach((el) => {
          const { mq, rules } = el;
          mq.removeEventListener("change", (event) =>
            handleMediaQueryChange(event, rules)
          );
        });
      }
    };
  }, [enhancedMediaQueryList, handleMediaQueryChange]);

  const setIsScrollingControlled = useCallback(() => {
    // Clear our timeout throughout the scroll
    clearTimeout(isScrollingTimeout.current);
    setIsScrolling(true);
    setIsTransitioning(false);

    // Set a timeout to run after scrolling ends
    isScrollingTimeout.current = setTimeout(() => {
      setIsScrolling(false);
      setIsProgrammaticallyScrolling(false);
      setIsTransitioning(false);
    }, 66) as unknown as number;
  }, [isScrollingTimeout, setIsScrolling]);

  const setCarouselScrollLeftPosition = (
    carouselDOMElement: HTMLDivElement,
    slideIndex: number
  ) => {
    if (carouselDOMElement && !isScrolling) {
      const slidesDOMElements = Array.from(
        carouselDOMElement.querySelectorAll("[data-slide-item]")
      ) as HTMLDivElement[];
      const currentSlideDOMElement = slidesDOMElements[slideIndex];
      const newOffsetPosition =
        currentSlideDOMElement.offsetLeft - carouselDOMElement.offsetLeft;

      setIsProgrammaticallyScrolling(true);

      // eslint-disable-next-line no-param-reassign
      carouselDOMElement.scrollLeft = newOffsetPosition;

      setTimeout(() => {
        setIsTransitioning(false);
      }, transitionDuration * 1.2);
    }
  };

  useEffect(() => {
    if (didMount.current) {
      if (withScrollbar && carouselRef.current) {
        setCarouselScrollLeftPosition(carouselRef.current, currentSlide.index);
      }

      if (
        currentSlide &&
        onChangeSlide &&
        typeof onChangeSlide === "function"
      ) {
        onChangeSlide(currentSlide);
      }
    } else {
      didMount.current = true;
      setTimeout(() => {
        setTrackTransition(
          `transform ${getTrackTransitionSpeedMs()}ms ease-out`
        );
        setIsTransitioning(false);
      }, transitionDuration);
    }
  }, [currentSlide, onChangeSlide]);

  const disableTransition = useCallback(() => {
    setTrackTransition("none");
  }, []);

  const slideWidthPercent = useMemo(
    () => getSlideWidthPercent(slides),
    [slides]
  );

  const findSlideTranslateValue = (slideIndex: number) => {
    return slides.findIndex((slide) => slide.index === slideIndex);
  };

  useEffect(() => {
    if (
      transitionDuration > 0 &&
      trackTransition !== "none" &&
      !isTransitioning
    ) {
      setIsTransitioning(true);
    }
  }, [currentSlide.index]);

  useEffect(() => {
    const newTranslateValue = findSlideTranslateValue(currentSlide.index);

    setTrackTranslateXValue(-(newTranslateValue * slideWidthPercent));
  }, [currentSlide.index, slideWidthPercent]);

  useEffect(() => {
    if (previousIsTouchInteracting && !isTouchInteracting) {
      const newTranslateValue = findSlideTranslateValue(currentSlide.index);
      setTrackTranslateXValue(-(newTranslateValue * slideWidthPercent));
    }
  }, [
    previousIsTouchInteracting,
    isTouchInteracting,
    setTrackTranslateXValue,
    currentSlide.index,
    slideWidthPercent,
  ]);

  const handleDragStart = useCallback(
    (event) => {
      setIsTouchInteracting(true);

      if (event.touches) {
        if (event.touches.length > 1) {
          return;
        }
        const { touches } = event;
        // eslint-disable-next-line prefer-destructuring, no-param-reassign
        event = touches[0];
      }

      const origin = {
        x: event.screenX,
        y: event.screenY,
      };

      setSlidesTabIndex(-1);
      disableTransition();
      carouselOriginCoordinates.current = origin;
      event.preventDefault(); // stops weird link dragging effect
    },
    [disableTransition]
  );

  const handleDragMove = useCallback(
    (event) => {
      // Disable dragging when scrolling is activated
      // dragging is ebaled on mobile devices by the scroll
      // behaviour and managed by css
      if (withScrollbar) {
        return;
      }

      if (carouselOriginCoordinates.current) {
        const pressionPoint = event.touches ? event.touches[0] : event;
        const translate = {
          x: pressionPoint.screenX - carouselOriginCoordinates.current.x,
          y: pressionPoint.screenY - carouselOriginCoordinates.current.y,
        };
        lastTranslate.current = translate;

        const baseTranslate = (currentSlide.index * -100) / slides.length;

        const translateValue =
          baseTranslate +
          (100 * (translate.x / getTrackTotalWidthPercent(slides))) /
            slides.length;

        setTrackTranslateXValue(translateValue);
      }
    },
    [
      getTrackTotalWidthPercent,
      slides,
      currentSlide?.index,
      setTrackTranslateXValue,
    ]
  );

  const onDragStop = useCallback(() => {
    const hasOriginPoints = carouselOriginCoordinates.current;
    if (hasOriginPoints && lastTranslate.current && carouselRef.current) {
      // enableTransition();

      setTrackTransition(`transform ${getTrackTransitionSpeedMs()}ms ease-out`);
      const carouselElementWidth = carouselRef.current.offsetWidth;

      const differenceBetweenLastTranslateAndCurrentTranslate =
        previousTranslateX === undefined
          ? Math.abs(lastTranslate.current.x)
          : Math.abs(lastTranslate.current.x - previousTranslateX);

      const movementAmplitude = Math.abs(
        lastTranslate.current.x / carouselElementWidth
      );

      if (
        differenceBetweenLastTranslateAndCurrentTranslate > 0 &&
        movementAmplitude > 0.07
      ) {
        setIsDragMoving(true);
        if (lastTranslate.current.x < 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      } else {
        goTo(currentSlide.index);
      }
    }
    setIsTouchInteracting(false);
    carouselOriginCoordinates.current = null;
    setTimeout(() => {
      setSlidesTabIndex(0);
      setIsDragMoving(false);
    }, getTrackTransitionSpeedMs() * 2);
  }, [
    currentSlide?.index,
    goToNext,
    goToPrevious,
    goTo,
    getTrackTransitionSpeedMs,
    carouselRef,
  ]);

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      if (isDragMoving) {
        event?.preventDefault();
      }
    },
    [isDragMoving]
  );

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event?.propertyName !== "transform") {
        return;
      }

      if (currentSlide?.isClone === true) {
        disableTransition();

        const realSlideIndexToGo = slides.findIndex(
          (slide) => slide.indexId === currentSlide.indexId && !slide.isClone
        );

        goTo(realSlideIndexToGo);

        setTimeout(
          () => {
            setTrackTransition(
              `transform ${getTrackTransitionSpeedMs()}ms ease-out`
            );
            setIsTransitioning(false);
          },
          transitionDuration / 4 > 0 ? transitionDuration / 4 : 20
        );
      } else {
        setIsTransitioning(false);
      }
    },
    [
      currentSlide?.indexId,
      setIsTransitioning,
      getTrackTransitionSpeedMs,
      goTo,
      slides,
    ]
  );

  const handleClickDot = useCallback(
    (slideIndex) => {
      goTo(slideIndex);
    },
    [goTo, slides, carouselRef]
  );

  const getSliderSlidesElements = (sliderDOMElement: HTMLDivElement) => {
    const sliderSlidesElements = sliderDOMElement
      ? sliderDOMElement.querySelectorAll("[data-slide-item]")
      : [];

    return Array.from(sliderSlidesElements) as HTMLElement[];
  };

  const handleSliderScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      setIsScrollingControlled();
      if (
        infinite ||
        loop ||
        !withScrollbar ||
        isProgrammaticallyScrolling ||
        isTransitioning ||
        !isScrolling
      ) {
        return;
      }
      setIsTransitioning(false);

      const { currentTarget }: { currentTarget: HTMLElement } = event;
      const { scrollLeft } = currentTarget;

      if (carouselRef && carouselRef.current) {
        const sliderSlidesElements = getSliderSlidesElements(
          carouselRef.current
        );
        const carouselOffsetWitdh = carouselRef.current.offsetWidth;

        const sliderItemsDistancesWithCenter = sliderSlidesElements
          .map((el, index) => {
            const elCenterPosition = el.offsetLeft + el.offsetWidth / 2;
            const differenceWithCenter = Math.abs(
              elCenterPosition - (carouselOffsetWitdh / 2 + scrollLeft)
            );
            return {
              index,
              differenceWithCenter,
            };
          })
          .sort((a, b) => a.differenceWithCenter - b.differenceWithCenter);

        const currentSlideIndexInView = sliderItemsDistancesWithCenter[0].index;

        goTo(currentSlideIndexInView);
      }
    },
    [
      carouselRef,
      setIsTransitioning,
      setIsScrolling,
      infinite,
      loop,
      withScrollbar,
      isProgrammaticallyScrolling,
      goTo,
      isTransitioning,
      isScrolling,
    ]
  );

  const handleMouseEnterInSliderControls = useCallback(() => {
    // setIsScrolling(false);
  }, [setIsScrolling]);

  const handleTouchStartOnSliderControls = useCallback(() => {
    // setIsScrolling(false);
  }, [setIsScrolling]);

  const handleMouseLeaveOfCarousel = useCallback(() => {
    // setIsScrolling(false);
  }, [setIsScrolling]);
  const handleTouchEndOnCarousel = useCallback(() => {
    // setIsScrolling(false);
  }, [setIsScrolling]);

  const handleTouchStartOnCarousel = useCallback(() => {
    // setIsScrolling(true);
  }, [setIsScrolling]);
  const handleMouseEnterInCarousel = useCallback(() => {
    // setIsScrolling(true);
  }, [setIsScrolling]);

  const mergedTranslations = useMemo(
    () => ({
      ...defaultTranslationsMessages,
      ...translations,
    }),
    [translations]
  );
  const fullSizeClassName = fullSize
    ? ` ${CAROUSEL_CLASSNAME}-wrapper--fullsize`
    : "";
  const carouselWrapperClassNames = cls([
    `${CAROUSEL_CLASSNAME}-wrapper${fullSizeClassName}`,
    !!className && className,
  ]);

  const carouselClassNames = cls([
    CAROUSEL_CLASSNAME,
    debugMode && CAROUSEL_CLASSNAME_DEBUG_MODE,
    !infinite && !loop && withScrollbar === true && `scrollable`,
  ]);

  const transformValue = `translateX(${trackTranslateXValue}%)`;

  return (
    <div className={carouselWrapperClassNames}>
      <div className={`${CAROUSEL_CLASSNAME}-inner-wrapper`}>
        <div
          className={carouselClassNames}
          role="region"
          aria-label="Carousel"
          ref={carouselRef}
          style={{
            ...mediaQueryCssStyles,
          }}
          onScroll={handleSliderScroll}
        >
          <div
            ref={carouselTrackRef}
            data-testid="carousel-track"
            className={CAROUSEL_TRACK_CLASSNAME}
            style={{
              transition: withScrollbar ? "" : trackTransition,
              transform: withScrollbar ? "" : transformValue,
              width: `${getTrackTotalWidthPercent(slides)}%`,
            }}
            onTouchStart={
              withScrollbar ? handleTouchStartOnCarousel : handleDragStart
            }
            onMouseEnter={handleMouseEnterInCarousel}
            onMouseDown={handleDragStart}
            onTouchMove={handleDragMove}
            onMouseMove={handleDragMove}
            onTouchEnd={withScrollbar ? handleTouchEndOnCarousel : onDragStop}
            onTouchCancel={onDragStop}
            onMouseUp={onDragStop}
            onMouseLeave={
              withScrollbar ? handleMouseLeaveOfCarousel : onDragStop
            }
            onTransitionEnd={handleTransitionEnd}
            onClick={handleClick}
          >
            {slides.map((slide: SlideItem, index) => {
              const isSlideActive = slide.id === currentSlide?.id;
              return (
                <Slide
                  key={`${slide.id}##${slide.indexId}${index.toString(36)}`}
                  id={`${slide.id}${slide?.isClone ? "#clone" : ""}`}
                  isActive={isSlideActive}
                  className={itemClassName}
                  index={slide.indexId}
                  width={slideWidthPercent}
                  autoFocus={autoFocus}
                  carouselTrackRef={carouselTrackRef}
                  debugMode={debugMode}
                  slidePadding={slidePadding}
                  tabIndex={slidesTabIndex}
                  // pointerEvents={slidesTabIndex === 0 ? undefined : "none"}
                >
                  <>{slide.element}</>
                </Slide>
              );
            })}
          </div>
        </div>
        <Controls
          currentSlide={currentSlide}
          controlButtonType={controlButtonType}
          goToPrevious={goToPrevious}
          goToNext={goToNext}
          locale={locale}
          mergedTranslations={mergedTranslations}
          loop={loop}
          infinite={infinite}
          hasReachedLastSlide={hasReachedLastSlide}
          disabled={isTransitioning}
          onMouseEnter={handleMouseEnterInSliderControls}
          onTouchStart={handleTouchStartOnSliderControls}
        />
      </div>
      {dots ? (
        <ul
          role="tablist"
          className={cls([
            "r-r__dots",
            dotsPosition === "left" && "r-r__dots--left",
            dotsPosition === "center" && "r-r__dots--center",
            dotsPosition === "right" && "r-r__dots--right",
          ])}
          onMouseEnter={handleMouseEnterInSliderControls}
          onTouchStart={handleTouchStartOnSliderControls}
        >
          {slides
            .filter((slide) => !slide.isClone)
            .map((slide: SlideItem, index) => {
              return (
                <li
                  key={`r-r__dot##${slide.id}##${index.toString(36)}`}
                  className={cls([
                    "r-r__dot",
                    slide.indexId === currentSlide.indexId &&
                      "r-r__dot--active",
                  ])}
                  role="presentation"
                >
                  <button
                    type="button"
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to slide ${slide.indexId + 1}`}
                    onClick={() => handleClickDot(slide.index)}
                    className={cls([dotsStyle === "numbers" && "with-number"])}
                  >
                    {dotsStyle === "numbers" ? slide.indexId + 1 : null}
                  </button>
                </li>
              );
            })}
        </ul>
      ) : null}
      {debugMode && (
        <Debug
          isTouchInteracting={isTouchInteracting}
          trackTranslateXValue={trackTranslateXValue}
          slidesTabIndex={slidesTabIndex}
          currentNumberOfVisibleSlides={currentNumberOfVisibleSlides}
          trackTransition={trackTransition}
          mediaQueryCssStyles={mediaQueryCssStyles}
          transformValue={transformValue}
          className={className}
          itemClassName={itemClassName}
          initialIndex={initialIndex}
          infinite={infinite}
          loop={loop}
          onChangeSlide={onChangeSlide}
          fallback={fallback}
          numVisibleSlides={numVisibleSlides}
          locale={locale}
          autoFocus={autoFocus}
          responsive={responsive}
          transitionDuration={transitionDuration}
          currentSlide={currentSlide}
          direction={direction}
        />
      )}
    </div>
  );
};

export default CarouselUI;
