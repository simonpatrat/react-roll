import React from "react";
import { SlideItem } from "../../lib/useSlides";
import { Translations } from "../../lib/translations/translations.types";

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
  // eslint-disable-next-line no-unused-vars
  onChangeSlide?: (newSlide: SlideItem) => void;
  numVisibleSlides?: number;
  locale?: string;
  autoFocus?: boolean;
  responsive?: CarouselResponsiveProp;
  fallback?: React.ReactElement;
  transitionDuration?: number;
  debugMode?: boolean;
  slidePadding?: string;
  translations?: Translations;
  dots?: boolean;
  dotsStyle?: "numbers" | "dots";
  dotsPosition?: "left" | "right" | "center";
  controlButtonType?: "icon" | "text";
}
