import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

interface SeoProps {
  description?: string
  title: string
  keywords?: string[]
  children?: React.ReactNode
}

const Seo: React.FC<SeoProps> = ({ description, title, keywords = [], children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const metaKeywords = keywords.length > 0 ? keywords.join(", ") : "architecture, visualization, interior design, KIJ Studio"

  return (
    <Helmet
      title={title || defaultTitle}
      titleTemplate={description ? `%s | ${metaDescription}` : undefined}
    >
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </Helmet>
  )
}

export default Seo 