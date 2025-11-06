import * as React from "react"
import { SVGProps } from "react"
const SvgWater = (props: SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="1em" 
    height="1em"
    fill="none" 
    viewBox="0 0 24 24" 
    {...props}
    >
    <path
      fill="#fff"
      d="M12 20a6 6 0 0 1-6-6c0-4 6-10.75 6-10.75S18 10 18 14a6 6 0 0 1-6 6Z"
    />
  </svg>
);
export default SvgWater
