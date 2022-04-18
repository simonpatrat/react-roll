import { SlideItem } from "../../common/types";
import { CarouselProps } from "../Carousel/Carousel.types";

export interface ControlsProps {
  currentSlide: SlideItem;
  controlButtonType: CarouselProps["controlButtonType"];
  goToPrevious: () => void;
  goToNext: () => void;
  mergedTranslations: CarouselProps["translations"];
  loop: CarouselProps["loop"];
  hasReachedLastSlide: boolean;
  locale: string;
  infinite?: boolean;
}
