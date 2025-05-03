import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { useState } from "react"

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
  const visualizations = Array(4).fill(data.allSanityVisualisation.nodes).flat()

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 4
  const maxIndex = visualizations.length - itemsPerPage

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const visibleVisualizations = visualizations.slice(currentIndex, currentIndex + itemsPerPage)

  return (
    <Layout>
      <Seo
        title="Visualizations"
        description="Explore our architectural visualizations and 3D renderings"
      />
      <div className="slider-container">
        <button className="slider-arrow left" onClick={handlePrev} disabled={currentIndex === 0}>
          &lsaquo;
        </button>
        <div className="slider-track">
          {visibleVisualizations.map((visualization, index) => (
            <div 
              key={index + currentIndex} 
              className="slider-tile"
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
        <button className="slider-arrow right" onClick={handleNext} disabled={currentIndex === maxIndex}>
          &rsaquo;
        </button>
      </div>
      <style>
        {`
          .slider-container {
            display: flex;
            align-items: center;
            justify-content: center;
            max-width: var(--max-content-width);
            width: 100%;
            margin: 0 auto;
            position: relative;
            padding: 0;
            overflow: visible;
          }
          .slider-arrow {
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            font-size: 2rem;
            width: 2.5rem;
            font-weight: 500;
            height: 4rem;
            border-radius: 0;
            cursor: pointer;
            z-index: 10;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-family: Arial, sans-serif;
            line-height: 0;
            padding: 0 0 0.5rem 0;
          }
          .slider-arrow.left {
            left: -2.5rem;
          }
          .slider-arrow.right {
            right: -2.5rem;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
          .slider-arrow:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          .slider-track {
            display: grid;
            grid-template-columns: repeat(${itemsPerPage}, 1fr);
            gap: 1.5rem;
            width: 100%;
          }
          .slider-tile {
            width: 100%;
            aspect-ratio: 2/4;
            min-width: 200px;
            max-height: 70vh;
            overflow: hidden;
            position: relative;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
          }
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
            font-weight: 300;
            opacity: 0;
            transition: opacity 0.3s ease;
            font-family: "futura-pt", sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .visualization-wrapper:hover .hover-content {
            background: rgba(0, 0, 0, 0.5);
          }
          .visualization-wrapper:hover .image-title {
            opacity: 1;
          }
          @media (max-width: 1200px) {
            .slider-arrow.left {
              left: -2.5rem;
            }
            .slider-arrow.right {
              right: -2.5rem;
            }
          }
          @media (max-width: 900px) {
            .slider-track {
              grid-template-columns: repeat(2, 1fr);
              gap: 1rem;
            }
            .slider-arrow.left {
              left: -2.5rem;
            }
            .slider-arrow.right {
              right: -2.5rem;
            }
          }
          @media (max-width: 700px) {
            .slider-container {
              margin: 0 auto;
              padding: 0;
            }
            .slider-track {
              grid-template-columns: repeat(1, 1fr);
            }
            .slider-tile {
              min-width: 150px;
              aspect-ratio: 1/1.7;
              max-height: 60vh;
            }
            .slider-arrow.left {
              left: 0;
              border-radius: 0 4px 4px 0;
            }
            .slider-arrow.right {
              right: 0;
              border-radius: 4px 0 0 4px;
            }
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
