export const defaultStoryProps = {
  initialIndex: 0,
  infinite: false,
  loop: false,
  // eslint-disable-next-line no-console
  onChangeSlide: (...args: any) => console.log("Slide Changed", { ...args }),
  numVisibleSlides: 1,
  locale: "en",
  autoFocus: true,
  transitionDuration: 300,
  debugMode: false,
  dots: true,
  dotsStyle: "dots",
  dotsPosition: "center",
  controlButtonType: "icon",
};
