import Link from "next/link"

type ButtonProps = {
  children: React.ReactNode
  href?: string
  className?: string
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className"
>

export default function Button({
  children,
  href,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base = `w-full rounded-md py-3 text-white font-semibold ${
    disabled
      ? "bg-gray-400 cursor-not-allowed opacity-70 pointer-events-none"
      : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
  }`
  const classes = `${base} ${className}`.trim()

  if (href) {
    // Render a link when href is provided
    return (
      <Link href={href} className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </Link>
    )
  }

  return (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} disabled={disabled} className={classes}>
      {children}
    </button>
  )
} 
