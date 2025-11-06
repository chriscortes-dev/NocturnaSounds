import * as React from "react";
import type { SVGProps } from "react";
const SvgBolt = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9 15H5.9q-.6 0-.888-.537t.063-1.038l7.475-10.75a1.3 1.3 0 0 1 .65-.487q.4-.137.825.012t.625.525.15.8L14 10h3.875q.65 0 .913.575t-.163 1.075L10.4 21.5a1.27 1.27 0 0 1-.675.425 1.13 1.13 0 0 1-.775-.075 1.3 1.3 0 0 1-.587-.537 1.24 1.24 0 0 1-.163-.788z"
    />
  </svg>
);
export default SvgBolt;
