import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import "./carousel.scss";
import { SlideItem, useSlides } from "../../lib/useSlides";
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

const Carousel: React.FunctionComponent<CarouselProps> = ({
  children,
  className,
  itemClassName,
  initialIndex,
  infinite = false, // TODO: infinite carousel
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
  // const offset = carouselTrackRef * 2 - 1;
  const didMount = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const carouselOriginCoordinates = useRef<null | { x: number; y: number }>(
    null
  );
  const lastTranslate = useRef<null | { x: number; y: number }>(null);

  const {
    slides: baseSlideList,
    currentSlide,
    goTo,
    goToPrevious,
    goToNext,
    lastSlideIndex,
    hasReachedLastSlide,
    direction,
  } = useSlides(children, initialIndex, loop, infinite);

  const [trackTranslateXValue, setTrackTranslateXValue] = useState(0);
  const [slidesTabIndex, setSlidesTabIndex] = useState(0);
  const [isTouchInteracting, setIsTouchInteracting] = useState<boolean>(false);
  const [mediaQueryCssStyles, setMediaQueryCssStyles] = useState<
    Partial<CarouselResponsivePropRules>
  >({});

  const [currentNumberOfVisibleSlides, setCurrentNumberOfVisibleSlides] =
    useState<number>(numVisibleSlides);

  if (baseSlideList.length <= 0) {
    return fallback || null;
  }

  const distanceBetweenNextSlideAndCurrent = Math.abs(
    currentSlide.index - lastSlideIndex
  );
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
    `transform ${getTrackTransitionSpeedMs()}ms ease-out`
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

  const slides = infinite
    ? // TODO: correctly handle infinite mode
      // ? [
      //     ...baseSlideList.slice(baseSlideList.length - offset),
      //     ...baseSlideList,
      //     ...baseSlideList.slice(0, offset),
      //   ].map((slide, index) => {
      //     return {
      //       ...slide,
      //       // id: `${slide.id}#${index}`,
      //       index,
      //     };
      //   })
      baseSlideList
    : baseSlideList;

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

  const mergedTranslations = useMemo(
    () => ({
      ...defaultTranslationsMessages,
      ...translations,
    }),
    [translations]
  );

  useEffect(() => {
    if (didMount.current) {
      if (
        currentSlide &&
        onChangeSlide &&
        typeof onChangeSlide === "function"
      ) {
        onChangeSlide(currentSlide);
      }
    } else {
      didMount.current = true;
    }
  }, [currentSlide, onChangeSlide]);

  const disableTransition = useCallback(() => {
    setTrackTransition("none");
  }, []);

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
    },
    [disableTransition]
  );

  const handleDragMove = useCallback(
    (event) => {
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
      currentSlide.index,
      setTrackTranslateXValue,
    ]
  );

  const onDragStop = useCallback(() => {
    const hasOriginPoints = carouselOriginCoordinates.current;
    if (hasOriginPoints && lastTranslate.current && carouselRef.current) {
      // enableTransition();

      setTrackTransition(`transform ${getTrackTransitionSpeedMs()}ms ease-out`);
      const carouselElementWidth = carouselRef.current.offsetWidth;

      if (Math.abs(lastTranslate.current.x / carouselElementWidth) > 0.07) {
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
    }, getTrackTransitionSpeedMs() * 2);
  }, [
    currentSlide.index,
    goToNext,
    goToPrevious,
    goTo,
    getTrackTransitionSpeedMs,
    carouselRef,
  ]);

  const handleTransitionEnd = useCallback(() => {
    // [...nums, ...nums.slice(0, 1)].slice(-7)
    console.log("TransitionEnd");
  }, []);

  const handleClickDot = useCallback(
    (slideIndex) => {
      goTo(slideIndex);
    },
    [goTo]
  );

  const carouselClassNames = cls([
    CAROUSEL_CLASSNAME,
    debugMode && CAROUSEL_CLASSNAME_DEBUG_MODE,
    !!className && className,
  ]);

  const slideWidthPercent = getSlideWidthPercent(slides);

  useEffect(() => {
    setTrackTranslateXValue(-(currentSlide.index * slideWidthPercent));
  }, [currentSlide.index, slideWidthPercent]);

  useEffect(() => {
    if (previousIsTouchInteracting && !isTouchInteracting) {
      setTrackTranslateXValue(-(currentSlide.index * slideWidthPercent));
    }
  }, [
    previousIsTouchInteracting,
    isTouchInteracting,
    setTrackTranslateXValue,
    currentSlide.index,
    slideWidthPercent,
  ]);

  const transformValue = `translateX(${trackTranslateXValue}%)`;

  return (
    <>
      <div className={`${CAROUSEL_CLASSNAME}-wrapper`}>
        <div className={`${CAROUSEL_CLASSNAME}-inner-wrapper`}>
          <div
            className={carouselClassNames}
            role="region"
            aria-label="Carousel"
            ref={carouselRef}
            style={{
              ...mediaQueryCssStyles,
            }}
          >
            <div
              ref={carouselTrackRef}
              className={CAROUSEL_TRACK_CLASSNAME}
              style={{
                transition: trackTransition,
                // || currentSlide.index * slideWidthPercent
                transform: transformValue,
                width: `${getTrackTotalWidthPercent(slides)}%`,
              }}
              onTouchStart={handleDragStart}
              onMouseDown={handleDragStart}
              onTouchMove={handleDragMove}
              onMouseMove={handleDragMove}
              onTouchEnd={onDragStop}
              onTouchCancel={onDragStop}
              onMouseUp={onDragStop}
              onMouseLeave={onDragStop}
              onTransitionEnd={handleTransitionEnd}
            >
              {slides.map((slide: SlideItem, index) => {
                const isSlideActive = slide.id === currentSlide?.id;
                return (
                  <Slide
                    key={`${slide.id}##${index.toString(36)}`}
                    id={`${slide.id}`}
                    isActive={isSlideActive}
                    className={itemClassName}
                    index={slide.index}
                    width={slideWidthPercent}
                    autoFocus={autoFocus}
                    carouselTrackRef={carouselTrackRef}
                    debugMode={debugMode}
                    slidePadding={slidePadding}
                    tabIndex={slidesTabIndex}
                    pointerEvents={slidesTabIndex === 0 ? undefined : "none"}
                  >
                    {slide.element}
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
            hasReachedLastSlide={hasReachedLastSlide}
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
          >
            {baseSlideList.map((slide: SlideItem, index) => {
              return (
                <li
                  key={`r-r__dot##${slide.id}##${index.toString(36)}`}
                  className={cls([
                    "r-r__dot",
                    slide.index === currentSlide.index && "r-r__dot--active",
                  ])}
                  role="presentation"
                >
                  <button
                    type="button"
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to slide ${slide.index + 1}`}
                    onClick={() => handleClickDot(slide.index)}
                    className={cls([dotsStyle === "numbers" && "with-number"])}
                  >
                    {dotsStyle === "numbers" ? slide.index + 1 : null}
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
    </>
  );
};

export default Carousel;
