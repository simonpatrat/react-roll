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
  /** React children */
  children?: React.ReactNode;
  /** class name */
  className?: string;
  /** class name for carousel item (slide) */
  itemClassName?: string;
  /** index of the slide the carousel should begin with */
  initialIndex?: number;
  infinite?: boolean;
  /** Loop from end to start and start to end */
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
  translations?: Translations;
}
