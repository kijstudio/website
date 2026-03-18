"use client";

import Slider, { SliderItem } from "@/components/slider";
import sliderStyles from "@/components/slider.module.css";
import { breakpoints } from "@/styles/breakpoints";

interface Props {
  items: SliderItem[];
}

export default function InteriorDesignContent({ items }: Props) {
  const renderHoverContent = (item: SliderItem) => {
    const shouldRender = item.title || item.location || item.livingArea;
    return (
      <div className={sliderStyles.hoverContent}>
        {shouldRender && (
          <div className={sliderStyles.hoverContentInner}>
            <h3 className={sliderStyles.imageTitle}>{item.title}</h3>
            <div className={sliderStyles.imageDetails}>
              {item.location && <p>{item.location}</p>}
              {item.livingArea && <p>{item.livingArea} m²</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  const fullScreenPredicate = (item: SliderItem) => {
    return item.singleImageGallery === true;
  };

  const handleItemClick = (item: SliderItem) => {
    if (item.singleImageGallery) {
      return;
    }
    return true;
  };

  return (
    <Slider
      items={items}
      renderHoverContent={renderHoverContent}
      itemsPerPageDefault={4}
      breakpoints={{
        mobile: breakpoints.md,
        tablet: breakpoints.lg,
        desktop: breakpoints.xl,
      }}
      mobileItems={1}
      tabletItems={2}
      transitionDuration={500}
      autoplay={true}
      autoplayInterval={5000}
      enableFullScreenView={false}
      fullScreenPredicate={fullScreenPredicate}
      onItemClick={handleItemClick}
    />
  );
}
