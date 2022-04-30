import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Carousel from "./Carousel";

import { SlideItem } from "../../common/types";

import { ImageBox, Card } from "./stories/components";

import { defaultStoryProps } from "./stories/helpers";

const locale = "en";

const handleChangeSlide = (newSlide: SlideItem) => {
  // eslint-disable-next-line no-console
  console.log("CHANGED SLIDE: ", newSlide);
};

export default {
  title: "Carousel",
  component: Carousel,
} as ComponentMeta<typeof Carousel>;

const Template1: ComponentStory<typeof Carousel> = (args) => (
  <Carousel {...args}>
    <Card key="1" index={1} />
    <Card key="2" index={2} />
    <Card key="3" index={3} />
    <Card key="4" index={4} />
    <Card key="5" index={5} />
    <Card key="6" index={6} />
    <Card key="7" index={7} />
    <Card key="8" index={8} />
    <Card key="9" index={9} />
    <Card key="10" index={10} />
  </Carousel>
);

const Template2: ComponentStory<typeof Carousel> = (args) => (
  <div
    style={{
      maxWidth: "600px",
      margin: "0 auto",
    }}
  >
    <Carousel {...args}>
      <ImageBox key="1" index={1} />
      <ImageBox key="2" index={2} />
      <ImageBox key="3" index={3} />
      <ImageBox key="4" index={4} />
      <ImageBox key="5" index={5} />
      <ImageBox key="6" index={6} />
      <ImageBox key="7" index={7} />
      <ImageBox key="8" index={8} />
    </Carousel>
  </div>
);

const Template3: ComponentStory<typeof Carousel> = (args) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      margin: "0 auto",
      position: "relative",
      paddingBottom: "56.25%",
    }}
  >
    <Carousel {...args}>
      <ImageBox key="1" index={1} fullSize />
      <ImageBox key="2" index={2} fullSize />
      <ImageBox key="3" index={3} fullSize />
      <ImageBox key="4" index={4} fullSize />
      <ImageBox key="5" index={5} fullSize />
      <ImageBox key="6" index={6} fullSize />
      <ImageBox key="7" index={7} fullSize />
      <ImageBox key="8" index={8} fullSize />
    </Carousel>
  </div>
);

const Template4: ComponentStory<typeof Carousel> = (args) => (
  <div
    style={{
      maxWidth: "95%",
      margin: "0 auto",
    }}
  >
    <Carousel {...args}>
      <ImageBox key="1" index={1} />
      <ImageBox key="2" index={2} />
      <ImageBox key="3" index={3} />
      <ImageBox key="4" index={4} />
      <ImageBox key="5" index={5} />
      <ImageBox key="6" index={6} />
      <ImageBox key="7" index={7} />
      <ImageBox key="8" index={8} />
    </Carousel>
  </div>
);

export const Basic = Template2.bind({});

Basic.args = {
  ...defaultStoryProps,
  className: "my-carousel-2",
  initialIndex: 0,
};

export const BasicInfinite = Template2.bind({});
BasicInfinite.args = {
  ...defaultStoryProps,
  infinite: true,
};

export const MultipleSlidesInfinite = Template2.bind({});
MultipleSlidesInfinite.args = {
  ...defaultStoryProps,
  numVisibleSlides: 3,
  slidePadding: `0.2%`,
  infinite: true,
};

export const FullSize = Template3.bind({});
FullSize.args = {
  ...defaultStoryProps,
  fullSize: true,
};

export const WithScrollBar = Template4.bind({});
WithScrollBar.args = {
  ...defaultStoryProps,
  numVisibleSlides: 3,
  withScrollbar: true,
  slidePadding: `0.3%`,
  dotsStyle: "numbers",
  dotsPosition: "right",
};

export const WithScrollBarAndResponsiveOptions = Template4.bind({});
WithScrollBarAndResponsiveOptions.args = {
  ...defaultStoryProps,
  numVisibleSlides: 5,
  withScrollbar: true,
  slidePadding: `0.3%`,
  dotsStyle: "numbers",
  dotsPosition: "right",
  responsive: {
    1680: {
      numVisibleSlides: 4,
    },
    1024: {
      numVisibleSlides: 3,
    },
    768: {
      numVisibleSlides: 1,
      paddingRight: "20%",
    },
  },
};

export const MultipleSlidesWithResponsiveOptions = Template1.bind({});
MultipleSlidesWithResponsiveOptions.args = {
  ...defaultStoryProps,
  className: "my-carousel",
  // initialIndex={2}
  onChangeSlide: handleChangeSlide,
  numVisibleSlides: 4,
  // infinite
  locale,
  autoFocus: true,
  slidePadding: `8px`,
  dotsStyle: "numbers",
  responsive: {
    1366: {
      numVisibleSlides: 3,
    },
    1024: {
      numVisibleSlides: 2,
      paddingRight: "20%",
    },
    768: {
      numVisibleSlides: 1,
      paddingRight: "30%",
    },
  },
  children: [
    <Card key="1" index={1} />,
    <Card key="2" index={2} />,
    <Card key="3" index={3} />,
    <Card key="4" index={4} />,
    <Card key="5" index={5} />,
    <Card key="6" index={6} />,
    <Card key="7" index={7} />,
    <Card key="8" index={8} />,
    <Card key="9" index={9} />,
    <Card key="10" index={10} />,
  ],
};
