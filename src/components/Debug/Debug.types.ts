import { SlideItem } from "../../lib";
import {
  CarouselResponsivePropRules,
  CarouselProps,
} from "../Carousel/Carousel.types";

export interface DebugProps extends CarouselProps {
  isTouchInteracting: boolean;
  trackTranslateXValue: number;
  slidesTabIndex: number;
  currentNumberOfVisibleSlides: number;
  mediaQueryCssStyles: Partial<CarouselResponsivePropRules>;
  transformValue: string;
  currentSlide: SlideItem;
  trackTransition?: string;
  direction?: "left" | "right";
}
