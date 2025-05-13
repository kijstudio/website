import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `KIJ Studio`,
    description: `Bringing your dream spaces to life with creative design and breathtaking visuals.`,
    author: `KIJ Studio`,
    keywords: `KIJ Studio, interior design, architectural visualization, interior design, architectural design, interior design studio, architectural visualization studio, interior design studio, architectural visualization studio`,
    siteUrl: `https://kijstudio.com/`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-sanity`,
      options: {
        projectId: `53l346w4`,
        dataset: `production`,
        token: process.env.SANITY_TOKEN,
        graphqlTag: 'default',
        watchMode: true,
        overlayDrafts: true,
        imageOptions: {
          hotspot: true
        }
      },
    },
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `videos`,
        path: `${__dirname}/src/movies`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    // {
    //   resolve: `gatsby-plugin-manifest`,
    //   options: {
    //     name: `KIJ Studio`,
    //     short_name: `KIJ Studio`,
    //     start_url: `/`,
    //     background_color: `#ffffff`,
    //     display: `minimal-ui`,
    //     icon: `src/images/favicon.png`,
    //   },
    // },
  ],
}

export default config