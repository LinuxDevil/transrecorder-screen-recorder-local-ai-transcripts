import React from 'react'

export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props): React.JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="5,3 19,12 5,21 5,3" />
  </svg>
)
