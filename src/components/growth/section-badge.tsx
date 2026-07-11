type SectionBadgeProps = {
  children: React.ReactNode
  className?: string
}

export function SectionBadge({ children, className = '' }: SectionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-rule bg-paper-badge px-6 py-[5px] font-fell text-[15px] whitespace-nowrap md:text-[16px] ${className}`}
    >
      {children}
    </span>
  )
}
