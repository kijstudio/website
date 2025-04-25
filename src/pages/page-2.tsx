import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const SecondPage: React.FC<PageProps> = () => (
  <Layout>
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
)

export const Head: HeadFC = () => <Seo title="Page two" />

export default SecondPage 