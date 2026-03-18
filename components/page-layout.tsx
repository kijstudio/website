import Header from "@/components/header";
import layoutStyles from "./layout.module.css";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Header siteTitle="KIJ Studio" />
      <div className={layoutStyles.contentInner}>
        <main>{children}</main>
        <footer className={layoutStyles.footer}>
          © {currentYear}, Kij Studio
        </footer>
      </div>
    </>
  );
}
