import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import useBreakpoint from "../../Hooks/getBreakPoint";
import "./carousel.css";

const responsiveConfig = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 4 },
  desktop: { breakpoint: { max: 1280, min: 1050 }, items: 3 },
  tablet: { breakpoint: { max: 1049, min: 769 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};
const getItemsPerScreen = (breakpoint) => {
  return responsiveConfig[breakpoint]?.items || 1;
};

const ResponsiveCarousel = ({ children }) => {
  const breakpoint = useBreakpoint();
  const itemsPerScreen = getItemsPerScreen(breakpoint);
  const shouldCenter = children.length < itemsPerScreen;

  return (
    <Carousel
      lazyLoad="ondemand"
      responsive={responsiveConfig}
      infinite
      arrows
      showDots
      autoPlay={false}
      keyBoardControl
      renderDotsOutside={false}
      containerClass={`carousel-container ${
        shouldCenter ? "carousel-center-fallback" : ""
      }`}
      itemClass={`carousel-item ${
        shouldCenter ? "carousel-item-fallback" : ""
      }`}
      dotListClass="custom-dot-list"
      customTransition="all 0.5s"
    >
      {children}
    </Carousel>
  );
};

export default ResponsiveCarousel;
