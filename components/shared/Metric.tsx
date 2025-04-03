import Image from 'next/image'
import React from 'react'

interface MetricProps {
  imgUrl: string
  alt : string
  value : number | string
  title : string
  href?: string
  textStyles?: string
  isAuthor : Boolean 
}

const metricContent = ({imgUrl, alt, value, title, href, textStyles, isAuthor}: MetricProps) => {
  return (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : " "
          }`}
        ></span>
        {title}
      </p>
    </>
  );
}


const Metric = (props: MetricProps) => {
  return (
    <div className='flex-center flex-wrap gap-1'>
      {metricContent(props)}
    </div>
  )
}

export default Metric