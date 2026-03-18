import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/header";
import SplitScreen from "@/components/split-screen";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "KIJ Studio was founded by two Kraków-based architects who specialize in high-quality 3D renderings and visualizations, transforming architectural ideas into stunning, lifelike images.",
  keywords: [
    "contact",
    "about us",
    "KIJ Studio",
    "architecture firm",
    "visualization studio",
    "get in touch",
  ],
};

export default function AboutPage() {
  const leftContent = (
    <div className={styles.contactContentWrapper}>
      <div className={styles.contactContent}>
        <div className={styles.studioInfo}>
          <p className={styles.studioText}>
            KIJ STUDIO WAS FOUNDED BY TWO KRAKÓW-BASED ARCHITECTS WHO SPECIALIZE
            IN HIGH-QUALITY 3D RENDERINGS AND VISUALIZATIONS, TRANSFORMING
            ARCHITECTURAL IDEAS INTO STUNNING, LIFELIKE IMAGES. BY COMBINING
            CREATIVITY WITH PRECISION, WE BRING YOUR DESIGNS TO LIFE, ENSURING
            EVERY DETAIL IS CAREFULLY CRAFTED
          </p>
          <p>
            CONTACT:{" "}
            <a className={styles.contactLink} href="mailto:info@kijstudio.com">
              INFO@KIJSTUDIO.COM
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <Image
        src="/images/contact.jpg"
        alt="Contact"
        fill
        style={{ objectFit: "cover" }}
        sizes="60vw"
        quality={95}
      />
    </div>
  );

  return (
    <div className={styles.contactPage}>
      <Header
        siteTitle="KIJ Studio"
        isSticky={true}
        transparentBg={true}
        fullWidth={true}
        navColor="white"
        className={styles.header}
      />
      <SplitScreen
        leftContent={leftContent}
        rightContent={rightContent}
        fullWidth={true}
        leftRatio={4}
        rightRatio={6}
        backgroundImageSrc="/images/contact.jpg"
      />
    </div>
  );
}
