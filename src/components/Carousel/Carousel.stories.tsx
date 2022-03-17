import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Story, Meta } from "@storybook/react";

import Carousel from "./Carousel";
import { CarouselProps } from "./Carousel.types";
import { SlideItem } from "../../lib/useSlides";

const locale = "en";

const ImageBox = () => {
  const imgUrl = `https://picsum.photos/1024/576?random=${
    Math.floor(Math.random() * 100) + 1
  }`;

  return (
    <div>
      <img
        src={imgUrl}
        alt=""
        style={{
          maxWidth: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

const Card = () => {
  const imgUrl = `https://picsum.photos/768/432?random=${
    Math.floor(Math.random() * 100) + 1
  }`;

  return (
    <div
      className="card"
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: "5px",
        boxShadow: "2px 2px 10px 0 rgba(0,0,0, 0.2)",
        padding: "16px",
        overflow: "hidden",
      }}
    >
      <div
        className="card__image"
        style={{
          position: "relative",
          height: 0,
          paddingTop: "56.25%",
          background: "#343434",
          marginBottom: "16px",
        }}
      >
        <img
          src={imgUrl}
          alt=""
          style={{
            position: "absolute",
            maxWidth: "100%",
            height: "auto",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>
      <div className="card__header">
        <h3 className="card__title">Lorem ipsum dolor sit.</h3>
      </div>
      <div className="card__body">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Possimus
        facilis quod architecto asperiores ipsum, ipsa, placeat molestiae rerum
        nulla nobis laboriosam quia a excepturi autem cum odio similique. Soluta
        facere, non ducimus fuga nobis sed praesentium.
      </div>
    </div>
  );
};

const handleChangeSlide = (newSlide: SlideItem) => {
  // eslint-disable-next-line no-console
  console.log("CHANGED SLIDE: ", newSlide);
};

export default {
  title: "Carousel",
  component: Carousel,
} as Meta;

const Template1: Story<CarouselProps> = (args) => <Carousel {...args} />;

const Template2: Story<CarouselProps> = (args) => (
  <div
    style={{
      maxWidth: "800px",
      margin: "0 auto",
    }}
  >
    <Carousel {...args} />
  </div>
);

export const advanced = Template1.bind({});
export const Simple = Template2.bind({});

advanced.args = {
  className: "my-carousel",
  // initialIndex={2}
  onChangeSlide: handleChangeSlide,
  numVisibleSlides: 4,
  // infinite
  locale,
  autoFocus: true,
  slidePadding: `8px`,
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
    <Card key="1" />,
    <Card key="2" />,
    <Card key="3" />,
    <Card key="4" />,
    <Card key="5" />,
    <Card key="6" />,
    <Card key="7" />,
    <Card key="8" />,
    <Card key="9" />,
    <Card key="10" />,
  ],
};

Simple.args = {
  className: "my-carousel-2",
  children: [
    <ImageBox key="1" />,
    <ImageBox key="2" />,
    <ImageBox key="3" />,
    <ImageBox key="4" />,
    <ImageBox key="5" />,
    <ImageBox key="6" />,
    <ImageBox key="7" />,
    <ImageBox key="8" />,
  ],
};
