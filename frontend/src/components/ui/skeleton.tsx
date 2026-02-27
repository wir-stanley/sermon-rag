import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md bg-muted animate-shimmer-gold", className)}
      style={{
        background: "linear-gradient(90deg, hsl(var(--muted)) 25%, hsl(var(--gold) / 0.12) 50%, hsl(var(--muted)) 75%)",
        backgroundSize: "200% 100%",
      }}
      {...props}
    />
  )
}

export { Skeleton }
