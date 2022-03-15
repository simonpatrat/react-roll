import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Carousel from "./Carousel";

const NB_SLIDES = 7;

const renderSlides = (nbSlides: number) => {
  return Array(nbSlides)
    .fill("slide-placeholder")
    .map((_, index) => {
      return (
        <div key={`slide--${index.toString(36)}`}>I am a slide {index}</div>
      );
    });
};

const renderCarouselWithProps = (props, nbSlides = NB_SLIDES) => (
  <Carousel {...props}>{renderSlides(nbSlides)}</Carousel>
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
    await render(renderCarouselWithProps(baseProps));

    const selectedSlide = screen.getByTestId("r-r__slide##0");
    const ariaHidden = selectedSlide.getAttribute("aria-hidden");

    expect(ariaHidden).toBe("false");
  });

  it("renders the Carousel component with the initial active slide at index 0", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 3,
      })
    );

    const firstSlide = screen.getByTestId("r-r__slide##0");
    const ariaHiddenFirstSlide = firstSlide.getAttribute("aria-hidden");
    const selectedSlide = screen.getByTestId("r-r__slide##3");
    const ariaHidden = selectedSlide.getAttribute("aria-hidden");

    expect(ariaHiddenFirstSlide).toBe("true");
    expect(ariaHidden).toBe("false");
  });

  it("Should set active slide when clicking on navigation button", async () => {
    await render(
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

  it("should navigate to the next slide if it exist when clicking on the 'next' button", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 0,
      })
    );

    const nextButton = screen.getByRole("button", { name: "Go to next slide" });
    userEvent.click(nextButton);

    const firstSlide = screen.getByTestId("r-r__slide##0");
    const ariaHiddenFirstSlide = firstSlide.getAttribute("aria-hidden");
    const secondSlide = screen.getByTestId("r-r__slide##1");
    const ariaHiddenSecondSlide = secondSlide.getAttribute("aria-hidden");

    expect(ariaHiddenFirstSlide).toBe("true");
    expect(ariaHiddenSecondSlide).toBe("false");
  });

  it("should navigate to the previous slide if it exist when clicking on the 'previous' button", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 1,
      })
    );

    const previousButton = screen.getByRole("button", {
      name: "Go to previous slide",
    });

    userEvent.click(previousButton);

    const firstSlide = screen.getByTestId("r-r__slide##0");
    const ariaHiddenFirstSlide = firstSlide.getAttribute("aria-hidden");
    const secondSlide = screen.getByTestId("r-r__slide##1");
    const ariaHiddenSecondSlide = secondSlide.getAttribute("aria-hidden");

    expect(ariaHiddenFirstSlide).toBe("false");
    expect(ariaHiddenSecondSlide).toBe("true");
  });

  it("should hide previous button if loop mode is disabled and carousel is at first slide", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 0,
      })
    );

    const previousButton = screen.queryByRole("button", {
      name: "Go to previous slide",
    });

    expect(previousButton).toBe(null);
  });

  it("should hide next button if loop mode is disabled and last slide is reached", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: NB_SLIDES - 1,
      })
    );

    const nextButton = screen.queryByRole("button", {
      name: "Go to next slide",
    });

    expect(nextButton).toBe(null);
  });

  it("should NOT hide previous button if loop mode is enabled and carousel is at first slide", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 0,
        loop: true,
      })
    );

    const previousButton = screen.queryByRole("button", {
      name: "Go to previous slide",
    });

    expect(previousButton).toBeInTheDocument();
  });

  it("should NOT hide next button if loop mode is enabled and last slide is reached", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: NB_SLIDES - 1,
        loop: true,
      })
    );

    const nextButton = screen.queryByRole("button", {
      name: "Go to next slide",
    });

    expect(nextButton).toBeInTheDocument();
  });

  it('should hide carousel navigation "dots" buttons if prop "dots" is passed as "false"', async () => {
    const { queryByRole } = await render(
      renderCarouselWithProps({
        ...baseProps,
        dots: false,
      })
    );

    expect(queryByRole("tablist")).toBe(null);
  });

  it("should call the onChangeSlide callback function if given as a prop", async () => {
    const handleChangeSlide = jest.fn();

    await render(
      renderCarouselWithProps({
        ...baseProps,
        initialIndex: 0,
        onChangeSlide: handleChangeSlide,
      })
    );

    const nextButton = screen.getByRole("button", {
      name: "Go to next slide",
    });
    userEvent.click(nextButton);

    expect(handleChangeSlide).toHaveBeenCalledTimes(1);
  });

  it("should handle different languages with default translations", async () => {
    await render(
      renderCarouselWithProps({
        ...baseProps,
        locale: "fr",
      })
    );

    const nextButton = screen.getByRole("button", {
      name: "Aller au slide suivant",
    });

    expect(nextButton).toBeInTheDocument();
  });

  it("should render fallback component if given and no slides are given as children", async () => {
    const fallbackText = "Hello Fallback";
    await render(
      renderCarouselWithProps(
        {
          ...baseProps,
          locale: "fr",
          fallback: <div>{fallbackText}</div>,
        },
        0 // render without slides
      )
    );

    const carousel = screen.queryByRole("region", { name: "Carousel" });
    const fallback = screen.getByText(fallbackText);
    expect(carousel).toBe(null);
    expect(fallback).toBeInTheDocument();
  });

  it("should render nothing component if no fallback was given and no slides are given as children", async () => {
    const fallbackText = "Hello Fallback";
    await render(
      renderCarouselWithProps(
        {
          ...baseProps,
          locale: "fr",
        },
        0 // render without slides
      )
    );

    const carousel = screen.queryByRole("region", { name: "Carousel" });
    const fallback = screen.queryByText(fallbackText);
    expect(carousel).toBe(null);
    expect(fallback).toBe(null);
  });
});
