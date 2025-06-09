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
    "gatsby-plugin-sitemap",
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-source-sanity`,
      options: {
        projectId: `53l346w4`,
        dataset: `production`,
        token: process.env.SANITY_TOKEN,
        graphqlTag: "default",
        watchMode: true,
        overlayDrafts: true,
        imageOptions: {
          hotspot: true,
        },
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
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "G-086HYGYM9B", // Google Analytics / GA
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          // optimize_id: "OPT_CONTAINER_ID",
          // anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: false,
          // Setting this parameter is also optional
          respectDNT: true,
          // // Avoids sending pageview hits from custom paths
          // exclude: ["/preview/**", "/do-not-track/me/too/"],
          // // Defaults to https://www.googletagmanager.com
          // origin: "YOUR_SELF_HOSTED_ORIGIN",
          // Delays processing pageview events on route update (in milliseconds)
          delayOnRouteUpdate: 0,
        },
      },
    },
  ],
}

export default config
