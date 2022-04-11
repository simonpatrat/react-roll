import React, { useEffect, useState } from "react";
import { CAROUSEL_SLIDE_CLASSNAME } from "./constants";

export type SlideItem = {
  id: string;
  initial: boolean;
  element: React.ReactNode;
  index: number;
};

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
  infinite: boolean
): SlideItem[] | [] => {
  return [...createSlidesFromChildren(children, currentIndex, infinite)];
};

export const useSlides = (
  children: React.ReactNode,
  currentIndex: number = 0,
  loop: boolean = true,
  infinite: boolean = true
) => {
  const [slides, setSlides] = useState<[] | SlideItem[]>(
    getInitialSlides(children, currentIndex, infinite)
  );
  // const slides = infinite
  //   ? [
  //       ...baseSlideList.slice(
  //         baseSlideList.length - (numVisibleSlides * 2 - 1)
  //       ),
  //       ...baseSlideList,
  //       ...baseSlideList.slice(0, numVisibleSlides * 2 - 1),
  //     ].map((slide, index) => {
  //       return {
  //         ...slide,
  //         id: `${slide.id}#${index}`,
  //       };
  //     })
  //   : baseSlideList;
  const [currentSlide, setCurrentSlide] = useState(
    getInitialSlides(children, currentIndex, infinite)[currentIndex]
  );

  const [lastSlideIndex, setLastSlideIndex] = useState(currentIndex);

  const [hasReachedLastSlide, setHasReachedLastSlide] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

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
    const lastIndex = slides[slides.length - 1].index;
    const nextIndex = currentSlide.index + 1;
    if (nextIndex <= lastIndex) {
      goTo(nextIndex);
    } else if (loop) {
      goTo(0);
    }
  };

  const goToPrevious = (): void => {
    const lastIndex = slides[slides.length - 1].index;
    const previousIndex = currentSlide.index - 1;
    if (previousIndex >= 0) {
      goTo(previousIndex);
    } else if (loop) {
      goTo(lastIndex);
    }
  };

  return {
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
  };
};
