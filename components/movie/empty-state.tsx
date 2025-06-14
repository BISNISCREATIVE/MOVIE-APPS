import Link from "next/link"
import { EmptyStateIcon } from "@/components/ui/empty-state-icon"

interface EmptyStateProps {
  title?: string
  description?: string
  actionText?: string
  actionHref?: string
}

export function EmptyState({
  title = "Data Empty",
  description = "You don't have a favorite movie yet",
  actionText = "Explore Movie",
  actionHref = "/",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Updated Empty State Icon */}
      <div className="mb-8">
        <EmptyStateIcon width={200} height={200} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>

      <Link
        href={actionHref}
        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors"
      >
        {actionText}
      </Link>
    </div>
  )
}
