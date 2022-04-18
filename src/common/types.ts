import React from "react";

export type SlideItem = {
  id: string;
  initial: boolean;
  element: React.ReactNode;
  index: number;
  indexId: number;
  isClone?: boolean;
};
