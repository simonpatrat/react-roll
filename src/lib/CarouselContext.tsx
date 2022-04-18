import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { CAROUSEL_SLIDE_CLASSNAME } from "./constants";
import { SlideItem } from "..";

const createSlide = (
  item: React.ReactNode,
  index: number,
  isCurrent: boolean,
  id?: string
): SlideItem | null => {
  return {
    id: `${CAROUSEL_SLIDE_CLASSNAME}##${id || index.toString(36)}`,
    element: item || null,
    initial: isCurrent,
    index,
    indexId: index,
  };
};

const createSlidesFromChildren = (
  children: React.ReactNode,
  currentIndex: number,
  // eslint-disable-next-line no-unused-vars
  infinite: boolean
): SlideItem[] | [] => {
  if (!children) {
    return [];
  }
  const arrayChildren = React.Children.toArray(children);

  if (arrayChildren?.length > 0) {
    return React.Children.map(arrayChildren, (child, index) => {
      if (child) {
        const isCurrent = index === currentIndex;

        return createSlide(child, index, isCurrent);
      }
      return false;
    }).filter(Boolean);
  }
  return [];
};

const getInitialSlides = (
  children: React.ReactNode,
  currentIndex: number,
  infinite: boolean,
  numVisibleSlides: number
): SlideItem[] | [] => {
  const createdSlides = [
    ...createSlidesFromChildren(children, currentIndex, infinite),
  ];

  if (infinite && createdSlides?.length > 1) {
    const slidesWithClones = [...createdSlides];

    slidesWithClones.unshift(
      ...createdSlides.slice(-numVisibleSlides).map((slide) => ({
        ...slide,
        isClone: true,
      }))
    );
    slidesWithClones.push(
      ...createdSlides.slice(0, numVisibleSlides).map((slide) => ({
        ...slide,
        isClone: true,
      }))
    );

    return slidesWithClones.map((slide, index) => ({
      ...slide,
      index,
      indexId: slide.index,
    }));
  }

  return createdSlides.map((slide) => ({
    ...slide,
    indexId: slide.index,
  }));
};

export interface CarouselContextValue extends Record<string, unknown> {
  slides: SlideItem[];
  // eslint-disable-next-line no-unused-vars
  setSlides: (slides: SlideItem[]) => void;
  currentSlide: SlideItem;
  // eslint-disable-next-line no-unused-vars
  setCurrentSlide: (slide: SlideItem) => void;
  // eslint-disable-next-line no-unused-vars
  goTo: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  lastSlideIndex: number;
  hasReachedLastSlide: boolean;
  direction: "left" | "right";
  initialRenderDone?: boolean;
}

export const CarouselContext = createContext<CarouselContextValue>(
  {} as unknown as CarouselContextValue
);

const CarouselProvider = ({
  children,
  initialChildren,
  currentIndex = 0,
  loop,
  infinite,
  numVisibleSlides,
}: {
  initialChildren: React.ReactNode;
  children: React.ReactNode;
  loop: boolean;
  infinite: boolean;
  numVisibleSlides: number;
  currentIndex?: number;
}) => {
  const initialSlides = useMemo(() => {
    return getInitialSlides(
      initialChildren,
      currentIndex,
      infinite,
      numVisibleSlides
    );
  }, [initialChildren, currentIndex, infinite, numVisibleSlides]);
  const [slides, setSlides] = useState<[] | SlideItem[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(initialSlides[0]);
  const [lastSlideIndex, setLastSlideIndex] = useState(currentIndex);
  const [hasReachedLastSlide, setHasReachedLastSlide] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const initialrenderDone = useRef<boolean>(false);

  useEffect(() => {
    setSlides(
      getInitialSlides(
        initialChildren,
        currentIndex,
        infinite,
        numVisibleSlides
      )
    );
  }, [initialChildren, currentIndex, infinite, numVisibleSlides]);

  useEffect(() => {
    if (!currentSlide?.index) {
      return;
    }

    if (!slides[currentSlide.index + 1]) {
      setHasReachedLastSlide(true);
    } else {
      setHasReachedLastSlide(false);
    }
  }, [currentSlide?.index, setHasReachedLastSlide]);

  const goTo = (itemIndex: number): void => {
    setLastSlideIndex(currentSlide.index);

    setCurrentSlide(slides[itemIndex]);

    if (itemIndex > currentSlide.index) {
      setDirection("right");
    } else {
      setDirection("left");
    }
  };

  const goToNext = (): void => {
    const endIndex = slides[slides.length - 1].index;

    const nextIndex = currentSlide.index + 1;

    if (nextIndex <= endIndex) {
      goTo(nextIndex);
    } else if (loop || infinite) {
      goTo(0);
    }
  };

  const goToPrevious = (): void => {
    const endIndex = slides[slides.length - 1].index;

    const previousIndex = currentSlide.index - 1;

    if (previousIndex >= 0) {
      goTo(previousIndex);
    } else if (loop || infinite) {
      goTo(endIndex);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      if (initialrenderDone.current === false) {
        goTo(slides.findIndex((slide) => slide.indexId === currentIndex));
        initialrenderDone.current = true;
      }
    }
  }, [currentIndex, slides, initialrenderDone]);

  const value = {
    slides,
    setSlides,
    currentSlide,
    setCurrentSlide,
    goTo,
    goToNext,
    goToPrevious,
    lastSlideIndex,
    hasReachedLastSlide,
    direction,
    initialrenderDone: initialrenderDone.current,
  };
  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  );
};

export default CarouselProvider;
