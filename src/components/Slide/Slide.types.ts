import type { SlideItem } from "../../lib/useSlides";

export interface LoadedSlideItem extends Partial<SlideItem> {
  isActive: boolean;
  width: number;
}

export interface SlideProps extends Partial<SlideItem> {
  id: string;
  isActive: boolean;
  width: number;
  index: number;
  carouselTrackRef: React.RefObject<HTMLDivElement>;
  className?: string;
  children?: React.ReactNode;
  onLoad?: (element: HTMLDivElement, slideItem: LoadedSlideItem) => void;
  autoFocus?: boolean;
  debugMode?: boolean;
  slidePadding?: string;
  tabIndex?: number;
  pointerEvents?: "none" | undefined;
}
