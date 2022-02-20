import React, { useState } from "react";
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
  infinite: boolean
): SlideItem[] | [] => {
  if (!children) {
    return [];
  }
  const arrayChildren = React.Children.toArray(children);

  if (arrayChildren?.length > 0) {
    return React.Children.map(arrayChildren, (child, index) => {
      if (!!child) {
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

  const goTo = (itemIndex: number): void => {
    setLastSlideIndex(currentSlide.index);
    setCurrentSlide(slides[itemIndex]);
  };
  const goToNext = (): void => {
    const lastSlideIndex = slides[slides.length - 1].index;
    const nextIndex = currentSlide.index + 1;
    if (nextIndex <= lastSlideIndex) {
      goTo(nextIndex);
    } else if (loop) {
      goTo(0);
    }
  };

  const goToPrevious = (): void => {
    const lastSlideIndex = slides[slides.length - 1].index;
    const previousIndex = currentSlide.index - 1;
    if (previousIndex >= 0) {
      goTo(previousIndex);
    } else if (loop) {
      goTo(lastSlideIndex);
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
  };
};
