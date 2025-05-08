import { GatsbyNode } from 'gatsby'
import path from 'path' // Import path module

interface VisualisationNode {
  slug: {
    current: string
  }
  id: string
  // Add other fields if needed for context, though slug is primary for page creation
}

interface AllSanityVisualisation {
  nodes: VisualisationNode[]
}

interface GraphQLResult {
  allSanityVisualisation: AllSanityVisualisation
  // You can add other query results here if you have more page types
}

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Path to your new template component
  const visualizationTemplate = path.resolve(`./src/templates/visualization.tsx`)

  // Query for visualization slugs
  const result = await graphql<GraphQLResult>(`
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

  if (result.errors) {
    throw result.errors
  }

  const visualizations = result.data?.allSanityVisualisation.nodes

  // Create pages for each visualization
  visualizations?.forEach(visualization => {
    if (visualization.slug && visualization.slug.current) {
      console.log(visualization.id)
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

  // Add your other page creation logic here if needed
} 