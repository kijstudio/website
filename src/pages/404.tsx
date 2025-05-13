import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage: React.FC<PageProps> = () => (
  <Layout>
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Layout>
)

export const Head: HeadFC = () => <Seo title="404: Not Found" description="Page not found" />

export default NotFoundPage 