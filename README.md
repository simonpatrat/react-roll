# React Roll

![Actions](https://github.com/simonpatrat/react-roll/actions/workflows/tests-coverage.yml/badge.svg)
![Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/simonpatrat/c88ec2d98b0167edcab2f0ba52646cc1/raw/5aee486e0ab2d0c0a8d1ae25413b2fe4cf86839f/react-roll_coverage.json)

## Simple carousel component for React

#### [Storybook demo](https://simonpatrat.github.io/react-roll).

---

## How to use

```bash
npm i @simonpatrat/react-roll
```

or

```bash
yarn add @simonpatrat/react-roll
```

### Basic usage

```jsx
import React from "react";
import { Carousel } from "@simonpatrat/react-roll";

export default function MyCarousel() {
  return (
    <Carousel>
      {/* Each child is now a Slide */}
      <div>Hello</div>
      <div>World</div>
      <div>I am a slide</div>
    </Carousel>
  );
}
```

### Advanced usage

```jsx
import React from "react";
import { Carousel } from "@simonpatrat/react-roll";

export default function MyCarousel() {
  return (
    <Carousel
      autoFocus
      className="my-carousel"
      locale="en"
      numVisibleSlides={4}
      onChangeSlide={() => {}}
      responsive={{
        768: {
          numVisibleSlides: 1,
          paddingRight: "30%",
        },
        1024: {
          numVisibleSlides: 2,
          paddingRight: "20%",
        },
        1366: {
          numVisibleSlides: 3,
        },
      }}
      slidePadding="8px"
    >
      {/* Each child is now a Slide */}
      <div>Hello</div>
      <div>World</div>
      <div>I am a slide</div>
    </Carousel>
  );
}
```

### Todo

- [ ] Better documentation on props ([see storybook docs](https://simonpatrat.github.io/react-roll/?path=/docs/carousel--advanced))
- [ ] Async Slide Component
- [ ] Full Screen mode
- [ ] Improve Control buttons (positioning)
- [x] Typescript
- [x] scss support
- [x] Storybook
- [x] Tests
