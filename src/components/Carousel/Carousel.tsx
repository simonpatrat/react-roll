import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { SlideItem, useSlides } from "../../lib/useSlides";
import usePrevious from "../../lib/usePrevious";
import Slide from "../Slide/Slide";
import { cls } from "../../lib/utils";
import { importTranslations, getTranslation } from "../../lib/translations";
import {
  CAROUSEL_CLASSNAME,
  CAROUSEL_TRACK_CLASSNAME,
  CAROUSEL_CLASSNAME_DEBUG_MODE,
} from "../../lib/constants";

import "./carousel.scss";

export interface CarouselResponsivePropRules {
  numVisibleSlides: number;
  paddingRight?: string;
}

export type CarouselResponsiveProp = Record<
  number | string,
  CarouselResponsivePropRules
>;

export interface CarouselProps {
  children?: React.ReactNode;
  className?: string;
  itemClassName?: string;
  initialIndex?: number;
  infinite?: boolean;
  loop?: boolean;
  onChangeSlide?: (newSlide: SlideItem) => void;
  numVisibleSlides?: number;
  locale?: string;
  autoFocus?: boolean;
  responsive?: CarouselResponsiveProp;
  fallback?: React.ReactNode;
  transitionDuration?: number;
  debugMode?: boolean;
  slidePadding?: string;
}

const Carousel = ({
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
}: CarouselProps) => {
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
  } = useSlides(children, initialIndex, loop, infinite);
  const [translations, setTranslations] = useState({});
  const [trackTranslateXValue, setTrackTranslateXValue] = useState(0);
  const [slidesTabIndex, setSlidesTabIndex] = useState(0);
  const [isTouchInteracting, setIsTouchInteracting] = useState<boolean>(false);
  const [mediaQueryCssStyles, setMediaQueryCssStyles] = useState<
    Partial<CarouselResponsivePropRules>
  >({});

  const [currentNumberOfVisibleSlides, setCurrentNumberOfVisibleSlides] =
    useState<number>(numVisibleSlides);

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
    return responsive && Object.keys(responsive)?.length > 0
      ? Object.keys(responsive).map((bp: string, index: number) => {
          const previousBp = Object.keys(responsive)?.[index - 1];
          const previousBpValue = previousBp ? parseInt(previousBp, 10) - 1 : 0;
          return {
            bp,
            rules: responsive[bp],
            mq: window.matchMedia(
              `(min-width: ${previousBpValue}px) and (max-width: ${bp}px)`
            ),
          };
        })
      : null;
  }, [responsive]);

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
    (slides: SlideItem[]) => {
      return slides.length / currentNumberOfVisibleSlides;
    },
    [currentNumberOfVisibleSlides]
  );

  const getTrackTotalWidthPercent = useCallback(
    (slides: SlideItem[]) => {
      const ratio = getSlideWidthRatio(slides);
      return ratio * 100;
    },
    [getSlideWidthRatio]
  );

  const getSlideWidthPercent = (slides: SlideItem[]) => {
    const ratio = getSlideWidthRatio(slides);
    return 100 / currentNumberOfVisibleSlides / ratio;
  };

  const handleMediaQueryChange = useCallback(
    (event, rules: CarouselResponsivePropRules) => {
      if (event.matches) {
        const { numVisibleSlides, ...cssRules } = rules;
        setCurrentNumberOfVisibleSlides(numVisibleSlides);
        setMediaQueryCssStyles({ ...cssRules });
      }
    },
    []
  );

  useEffect(() => {
    if (enhancedMediaQueryList) {
      enhancedMediaQueryList.forEach((el) => {
        const { mq, rules } = el;

        if (mq.matches) {
          // console.log("MQ matches: ", mq.matches, bp);
          const { numVisibleSlides, ...cssRules } = rules;
          setCurrentNumberOfVisibleSlides(numVisibleSlides);
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

  useEffect(() => {
    (async function fetchTranslations() {
      const trans = await importTranslations(locale);

      setTranslations(trans);
    })();
  }, [locale]);

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

  // const enableTransition = useCallback(() => {
  //   console.log("=======> enabling transition");
  //   setTrackTransition(`transform ${trackTransition}ms ease-out`);
  // }, [trackTransition]);

  const handleDragStart = useCallback(
    (event) => {
      setIsTouchInteracting(true);

      if (event.touches) {
        if (event.touches.length > 1) {
          return;
        } else {
          event = event.touches[0];
        }
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

  const onDragStop = useCallback(
    (event) => {
      const hasOriginPoints = carouselOriginCoordinates.current;
      if (hasOriginPoints && lastTranslate.current && carouselRef.current) {
        // enableTransition();

        setTrackTransition(
          `transform ${getTrackTransitionSpeedMs()}ms ease-out`
        );
        let carouselElementWidth = carouselRef.current.offsetWidth;

        if (Math.abs(lastTranslate.current.x / carouselElementWidth) > 0.07) {
          if (lastTranslate.current.x < 0) {
            goToNext();
          } else {
            goToPrevious();
          }
        } else {
          console.log("GO TO: ", currentSlide.index);
          goTo(currentSlide.index);
        }
      }
      setIsTouchInteracting(false);
      carouselOriginCoordinates.current = null;
      setTimeout(() => {
        setSlidesTabIndex(0);
      }, getTrackTransitionSpeedMs() * 2);
    },
    [
      currentSlide.index,
      goToNext,
      goToPrevious,
      goTo,
      getTrackTransitionSpeedMs,
      carouselRef,
    ]
  );

  const handleClickNext = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const handleClickPrevious = useCallback(() => {
    goToPrevious();
  }, [goToPrevious]);

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

  // FIXME: Redo calculation
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

  // console.log("SLides tab index", slidesTabIndex);

  const transformValue = `translateX(${trackTranslateXValue}%)`;

  return (
    <>
      {slides?.length > 0 ? (
        <>
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
          <div className="r-r__controls">
            <button
              type="button"
              onClick={handleClickPrevious}
              aria-label={getTranslation(
                locale,
                "controls.buttons.previous.ariaLabel",
                translations
              )}
              className="r-r__button r-r__buton--previous"
            >
              {getTranslation(
                locale,
                "controls.buttons.previous.label",
                translations
              )}
            </button>
            <button
              type="button"
              onClick={handleClickNext}
              aria-label={getTranslation(
                locale,
                "controls.buttons.next.ariaLabel",
                translations
              )}
              className="r-r__button r-r__button--next"
            >
              {getTranslation(
                locale,
                "controls.buttons.next.label",
                translations
              )}
            </button>
          </div>
          <div className="r-r__dots">
            {baseSlideList.map((slide: SlideItem, index) => {
              return (
                <div
                  key={`r-r__dot##${slide.id}##${index.toString(36)}`}
                  className={cls([
                    "r-r__dot",
                    slide.index === currentSlide.index && "r-r__dot--active",
                  ])}
                >
                  <button
                    type="button"
                    aria-label={`Go to slide ${slide.index + 1}`}
                    onClick={() => handleClickDot(slide.index)}
                  >
                    {slide.index + 1}
                  </button>
                </div>
              );
            })}
          </div>
          {debugMode && (
            <footer className="debug-mode">
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
                        debugMode,
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
          )}
        </>
      ) : (
        fallback || null
      )}
    </>
  );
};

export default Carousel;
