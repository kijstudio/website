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
          <div 
            key={index} 
            style={{ 
              position: "relative",
              overflow: "hidden",
              aspectRatio: "4/3",
            }}
          >
            {visualization.gallery[0] && getImage(visualization.gallery[0].asset.gatsbyImageData) && (
              <div className="visualization-wrapper">
                <GatsbyImage
                  image={getImage(visualization.gallery[0].asset.gatsbyImageData)!}
                  alt={visualization.gallery[0].alt || visualization.title}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  objectFit="cover"
                />
                <div className="hover-content">
                  <h3 className="image-title">{visualization.title}</h3>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <style>
        {`
          .visualization-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          
          .hover-content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            transition: background-color 0.3s ease;
          }
          
          .image-title {
            color: white;
            margin: 20px;
            font-size: 1.2rem;
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .visualization-wrapper:hover .hover-content {
            background: rgba(0, 0, 0, 0.5);
          }
          
          .visualization-wrapper:hover .image-title {
            opacity: 1;
          }
        `}
      </style>
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
