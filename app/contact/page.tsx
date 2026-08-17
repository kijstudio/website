import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/header";
import SplitScreen from "@/components/split-screen";
import { getContactSettings } from "@/lib/sanity";
import { urlFor } from "@/lib/image";
import ContactForm from "./contact-form";
import styles from "./page.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with KIJ Studio to start your 3D visualization, interior design, or animation project. We usually reply within one business day.",
  keywords: [
    "contact",
    "get in touch",
    "KIJ Studio",
    "architectural visualization studio",
    "interior design studio",
    "enquiry",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | KIJ Studio",
    description:
      "Get in touch with KIJ Studio to start your 3D visualization, interior design, or animation project.",
    url: "https://kijstudio.com/contact",
  },
};

export default async function ContactPage() {
  const settings = await getContactSettings();
  const backgroundImage = settings?.backgroundImage;
  const backgroundImageUrl = backgroundImage?.asset
    ? urlFor(backgroundImage.asset).width(1600).quality(90).url()
    : "/images/contact.jpg";
  const backgroundImageAlt = backgroundImage?.alt || "KIJ Studio";

  // DOM order matters here, not just visual order: SplitScreen keeps
  // `leftContent` visible on mobile and hides `rightContent` behind it, so
  // the form (which must stay visible on mobile) goes in leftContent and
  // the image (hidden on mobile) goes in rightContent. `mirrored` then
  // flips their *visual* order on desktop only, putting the image on the
  // left and the form on the right, matching the about-us page's concept
  // with sides switched.
  const formContent = (
    <div className={styles.panel}>
      <ContactForm />
    </div>
  );

  const imageContent = (
    <div className={styles.visualWrap}>
      <Image
        src={backgroundImageUrl}
        alt={backgroundImageAlt}
        fill
        style={{ objectFit: "cover" }}
        sizes="60vw"
        quality={95}
        priority
      />
      <span className={styles.visualCap}>
        Kraków · Architectural Visualization
      </span>
    </div>
  );

  return (
    <div className={styles.contactPage}>
      <Header
        siteTitle="KIJ Studio"
        isSticky={true}
        transparentBg={true}
        fullWidth={true}
        // Unlike about-us (light panel left, dark image right), contact is
        // mirrored: the image is on the left and the always-white form
        // panel is on the right. The nav links render over that white
        // panel (the logo is the only element over the image), so they
        // need dark text to stay legible — white would disappear.
        navColor="black"
        className={styles.header}
      />
      <SplitScreen
        leftContent={formContent}
        rightContent={imageContent}
        fullWidth={true}
        leftRatio={6}
        rightRatio={4}
        mirrored={true}
      />
    </div>
  );
}
