import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const ContactPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem 0'
      }}>
        <h1>Contact Us</h1>
        
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Get in Touch</h2>
          <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            We'd love to hear from you. Whether you're interested in our visualization services,
            interior design projects, or just want to say hello, feel free to reach out.
          </p>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Email</h3>
            <p>info@kijstudio.com</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Phone</h3>
            <p>+48 123 456 789</p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Address</h3>
            <p style={{ lineHeight: '1.6' }}>
              KIJ Studio<br />
              ul. Example Street 123<br />
              00-000 Warsaw<br />
              Poland
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Business Hours</h3>
            <p style={{ lineHeight: '1.6' }}>
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const Head: HeadFC = () => <Seo title="Contact" />

export default ContactPage 