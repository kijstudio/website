import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface VisualizationNode {
  title: string
  description: string
  gallery: {
    asset: {
      gatsbyImageData: any
    }
    alt: string
    caption?: string
  }[]
}

interface VisualizationsPageData {
  allSanityVisualisation: {
    nodes: VisualizationNode[]
  }
}

const VisualizationsPage: React.FC<PageProps<VisualizationsPageData>> = ({
  data,
}) => {
  const visualizations = data.allSanityVisualisation.nodes

  return (
    <Layout>
      <Seo
        title="Visualizations"
        description="Explore our architectural visualizations and 3D renderings"
      />
      <h1>Visualizations</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          padding: "2rem 0",
        }}
      >
        {visualizations.map((visualization, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <h2>{visualization.title}</h2>
            <p>{visualization.description}</p>
            <div
              style={{
                display: "grid",
                gap: "1rem",
              }}
            >
              {visualization.gallery.map((image, imageIndex) => {
                const gatsbyImage = getImage(image.asset.gatsbyImageData)
                return gatsbyImage ? (
                  <div key={imageIndex}>
                    <GatsbyImage
                      image={gatsbyImage}
                      alt={image.alt}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    {image.caption && (
                      <p
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.9rem",
                          color: "#666",
                        }}
                      >
                        {image.caption}
                      </p>
                    )}
                  </div>
                ) : null
              })}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query VisualizationsQuery {
    allSanityVisualisation {
      nodes {
        title
        description
        gallery {
          asset {
            gatsbyImageData(
              width: 800
              placeholder: BLURRED
              formats: [AUTO, WEBP]
            )
          }
        }
        _rawGallery
      }
    }
  }
`

export default VisualizationsPage
