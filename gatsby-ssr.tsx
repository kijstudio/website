import * as React from "react"
import type { GatsbySSR } from "gatsby"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHeadComponents,
  setHtmlAttributes,
  setBodyAttributes,
}) => {
  setHtmlAttributes({ lang: "en" })
  setBodyAttributes({ className: "my-body-class" })
  setHeadComponents([
    <link
      key="typekit-font"
      rel="stylesheet"
      href="https://use.typekit.net/gzh3byk.css"
    />,
  ])
}

export const wrapRootElement: GatsbySSR["wrapRootElement"] = ({ element }) => {
  return element
} 