import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/header";
import layoutStyles from "@/components/layout.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your enquiry has been received by KIJ Studio.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <Header siteTitle="KIJ Studio" />
      <div
        className={layoutStyles.contentInner}
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "4rem 1.5rem",
        }}
      >
        <main>
          <h1>Thank you</h1>
          <p>
            Your enquiry is on its way. We&apos;ll get back to you with a
            first estimate and timeline within one business day.
          </p>
          <p>
            <Link href="/contact">Back to contact</Link>
          </p>
        </main>
      </div>
    </>
  );
}
