import * as React from "react"
import { graphql, PageProps, HeadFC } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface InteriorNode {
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

interface InteriorsPageData {
  allSanityInterior: {
    nodes: InteriorNode[]
  }
}

const InteriorsPage: React.FC<PageProps<InteriorsPageData>> = ({ data }) => {
  const interiors = data.allSanityInterior.nodes

  return (
    <Layout>
      <h1>Interiors</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '2rem 0'
      }}>
        {interiors.map((interior, index) => (
          <div key={index} style={{ marginBottom: '2rem' }}>
            <h2>{interior.title}</h2>
            <p>{interior.description}</p>
            <div style={{ 
              display: 'grid',
              gap: '1rem'
            }}>
              {interior.gallery.map((image, imageIndex) => {
                const gatsbyImage = getImage(image.asset.gatsbyImageData)
                return gatsbyImage ? (
                  <div key={imageIndex}>
                    <GatsbyImage
                      image={gatsbyImage}
                      alt={image.alt}
                      style={{ 
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px'
                      }}
                    />
                    {image.caption && (
                      <p style={{ 
                        marginTop: '0.5rem',
                        fontSize: '0.9rem',
                        color: '#666'
                      }}>
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

export const Head: HeadFC = () => <Seo title="Interiors" />

export const query = graphql`
  query InteriorsQuery {
    allSanityInterior {
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

export default InteriorsPage 