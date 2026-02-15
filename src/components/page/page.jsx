import React from 'react'
import { Helmet } from 'react-helmet'
const page = (props) => {
  const {title, children} = props
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  )
}

export default page
