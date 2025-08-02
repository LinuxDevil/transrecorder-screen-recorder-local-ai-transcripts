import React from 'react'

export const VideoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props): React.JSX.Element => (
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
    <rect x="2" y="7" width="15" height="10" rx="2" ry="2" />
    <polygon points="23 7 16 12 23 17 23 7" />
  </svg>
)
