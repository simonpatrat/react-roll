import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Carousel from "./Carousel";

const renderCarouselWithProps = (props) => (
  <Carousel {...props}>
    <div>Hello World Slide 1</div>
    <div>Hello World SLide 2</div>
    <div>I am a slide</div>
    <div>I am a slide</div>
    <div>I am a slide</div>
    <div>I am a slide</div>
    <div>I am a slide</div>
  </Carousel>
);

const baseProps = {
  autoFocus: true,
  className: "my-carousel",
  locale: "en",
  numVisibleSlides: 4,
  onChangeSlide: () => {},
  slidePadding: "8px",
};

describe("Carousel", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  it("renders the Carousel component with the initial active slide at index 0", async () => {
    const handleClickMock = jest.fn();

    const { debug } = await render(renderCarouselWithProps(baseProps));

    const selectedSlide = screen.getByTestId("r-r__slide##0");
    const ariaHidden = selectedSlide.getAttribute("aria-hidden");

    expect(ariaHidden).toBe("false");
  });

  it("renders the Carousel component with the initial active slide at index 0", async () => {
    const handleClickMock = jest.fn();

    const { debug } = await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 3,
      })
    );

    const firstSlide = screen.getByTestId("r-r__slide##0");
    const ariaHiddenFirstSlide = firstSlide.getAttribute("aria-hidden");
    const selectedSlide = screen.getByTestId("r-r__slide##3");
    const ariaHidden = selectedSlide.getAttribute("aria-hidden");
    debug();

    expect(ariaHiddenFirstSlide).toBe("true");
    expect(ariaHidden).toBe("false");
  });

  it("Should set active slide when clicking on naviagation button", async () => {
    const handleClickMock = jest.fn();

    const { debug } = await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 3,
      })
    );

    const button = screen.getByLabelText("Go to slide 6", {
      selector: "button",
    });

    userEvent.click(button);

    const firstSlide = screen.getByTestId("r-r__slide##0");
    const ariaHiddenFirstSlide = firstSlide.getAttribute("aria-hidden");
    const sixthSlide = screen.getByTestId("r-r__slide##5");
    const ariaHiddenSixthSlide = sixthSlide.getAttribute("aria-hidden");

    expect(ariaHiddenFirstSlide).toBe("true");
    expect(ariaHiddenSixthSlide).toBe("false");
  });
});
