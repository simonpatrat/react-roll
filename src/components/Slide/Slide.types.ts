import React from "react";
import { SlideItem } from "../../common/types";

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
  // eslint-disable-next-line no-unused-vars
  onLoad?: (element: HTMLDivElement, slideItem: LoadedSlideItem) => void;
  autoFocus?: boolean;
  debugMode?: boolean;
  slidePadding?: string;
  tabIndex?: number;
  pointerEvents?: "none" | undefined;
}
