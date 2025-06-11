import React from 'react'

interface ParsedContentProps {
  data: React.ReactNode;
}

const ParsedContent = ({ data }: ParsedContentProps) => {
  return (
    <div>{data}</div>
  )
}

export default ParsedContent