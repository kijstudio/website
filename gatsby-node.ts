import { GatsbyNode } from 'gatsby'

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions
  // Add your other page creation logic here if needed
} 