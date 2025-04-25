import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage: React.FC = () => {
  return (
    <Layout>
      <Seo 
        title="Home" 
        description="Welcome to KIJ Studio"
      >
        <meta name="keywords" content="interior design, visualization, architecture" />
      </Seo>
      <h1>Welcome to KIJ Studio</h1>
      <p>Discover our latest projects and designs.</p>
    </Layout>
  )
}

export default IndexPage 