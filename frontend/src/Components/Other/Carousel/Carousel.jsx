import React from "react";
import MultiCarousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Carousel.css";
const responsiveConfig = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 3 },
  desktop: { breakpoint: { max: 1280, min: 1050 }, items: 2 },
  tablet: { breakpoint: { max: 1049, min: 769 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 3 },
};

export default function Carousel({ slides = [] }) {
  if (!slides || slides.length === 0)
    return <div className="carousel-container"></div>;

  return (
    <>
      <div className="carousel-container desktop-carousel">
        <MultiCarousel
          responsive={responsiveConfig}
          infinite={slides.length > 1}
          autoPlay={slides.length > 1}
          autoPlaySpeed={4000}
          showDots={true}
          arrows={true}
          keyBoardControl
          customTransition="all 0.5s"
          containerClass="carousel-wrapper"
          dotListClass="custom-dot-list"
          itemClass="carousel-item"
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={slide.image}
                alt="Slider Image"
                className="large-carousel-image"
              />
            </div>
          ))}
        </MultiCarousel>
      </div>
    </>
  );
}
