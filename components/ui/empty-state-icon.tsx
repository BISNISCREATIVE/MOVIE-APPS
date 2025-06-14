import Image from "next/image"

interface EmptyStateIconProps {
  className?: string
  width?: number
  height?: number
}

export function EmptyStateIcon({ className = "", width = 200, height = 200 }: EmptyStateIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/images/empty-state.svg"
        alt="No data available"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  )
}
