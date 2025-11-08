interface OrganicBlobBackgroundProps {
  color?: string
  className?: string
  opacity?: number
}

export function OrganicBlobBackground({ 
  color = 'currentColor', 
  className = '', 
  opacity = 0.1 
}: OrganicBlobBackgroundProps) {
  // Generate a random but stable blob shape
  const blobId = `blob-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <svg
      className={`absolute pointer-events-none ${className}`}
      style={{ opacity }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`gradient-${blobId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#gradient-${blobId})`}
        d="M45.7,-45.7C58.7,-32.7,68.2,-16.4,67.8,-0.3C67.4,15.8,57.1,31.6,44.1,44.1C31.1,56.6,15.6,65.8,-0.3,66.1C-16.2,66.4,-32.4,57.8,-45.4,45.3C-58.4,32.8,-68.2,16.4,-68.2,-0.1C-68.2,-16.6,-58.4,-33.2,-45.4,-46.2C-32.4,-59.2,-16.2,-68.6,0.1,-68.7C16.4,-68.8,32.7,-59.6,45.7,-45.7Z"
        transform="translate(100 100)"
      />
      <filter id={`blur-${blobId}`}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
      </filter>
    </svg>
  )
}

