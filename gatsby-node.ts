import { GatsbyNode } from 'gatsby'
import path from 'path' // Import path module

interface VisualisationNode {
  slug: {
    current: string
  }
  id: string
  // Add other fields if needed for context, though slug is primary for page creation
}

interface InteriorNode {
  slug: {
    current: string
  }
  id: string
}

interface AllSanityVisualisation {
  nodes: VisualisationNode[]
}

interface AllSanityInterior {
  nodes: InteriorNode[]
}

interface GraphQLResult {
  allSanityVisualisation: AllSanityVisualisation
  allSanityInterior: AllSanityInterior  
  // You can add other query results here if you have more page types
}

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Path to your new template component
  const visualizationTemplate = path.resolve(`./src/templates/visualization.tsx`)
  const interiorTemplate = path.resolve(`./src/templates/interior.tsx`)
  // Query for visualization slugs
  const visualizationResult = await graphql<GraphQLResult>(`
    query {
      allSanityVisualisation {
        nodes {
          id
          slug {
            current
          }
        }
      }
    }
  `)

  const interiorsResult = await graphql<GraphQLResult>(`
    query {
      allSanityInterior {
        nodes {
          id
          slug { 
            current
          }
        }
      }
    }
  `)
  
  if (visualizationResult.errors) {
    throw visualizationResult.errors
  }

  if (interiorsResult.errors) { 
    throw interiorsResult.errors
  }

  const visualizations = visualizationResult.data?.allSanityVisualisation.nodes
  const interiors = interiorsResult.data?.allSanityInterior.nodes

  // Create pages for each visualization
  visualizations?.forEach(visualization => {
    if (visualization.slug && visualization.slug.current) {
      createPage({
        path: `/visualizations/${visualization.slug.current}`,
        component: visualizationTemplate,
        context: {
          // Pass slug or id to the template query
          slug: visualization.slug.current,
          id: visualization.id,
        },
      })
    } 
  })

  interiors?.forEach(interior => {
    if (interior.slug && interior.slug.current) {
      createPage({
        path: `/interior-design/${interior.slug.current}`,
        component: interiorTemplate,
        context: {
          // Pass slug or id to the template query
          slug: interior.slug.current,
          id: interior.id,
        },
      })
    } 
  })

  // Add your other page creation logic here if needed
} 