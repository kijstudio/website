"use client";

import Link from "next/link";
import Slider, { SliderItem } from "@/components/slider";
import styles from "./detail-content.module.css";

interface Props {
  title: string;
  description?: string;
  items: SliderItem[];
  backLink: string;
}

export default function DetailContent({
  title,
  description,
  items,
  backLink,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.descriptionColumn}>
        <Link href={backLink} className={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12H8.414l3.293-3.293a1 1 0 1 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L8.414 14H19a1 1 0 0 0 0-2z" />
          </svg>
        </Link>
        <div className={styles.descriptionWrapper}>
          <h1 className={styles.title}>{title}</h1>
          {description && description.trim() !== "" && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </div>
      <div className={styles.sliderColumn}>
        {items.length > 0 && (
          <Slider
            items={items}
            itemsPerPageDefault={2}
            mobileItems={1}
            tabletItems={1}
            breakpoints={{ mobile: 768, tablet: 992, desktop: 1200 }}
            enableFullScreenView={true}
          />
        )}
      </div>
    </div>
  );
}
