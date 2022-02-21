import { SlideItem } from "../../lib/useSlides";

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
