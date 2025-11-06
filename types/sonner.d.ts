declare module "sonner" {
  import * as React from "react"
  export const Toaster: React.FC<{
    position?:
      | "top-left"
      | "top-center"
      | "top-right"
      | "bottom-left"
      | "bottom-center"
      | "bottom-right"
    richColors?: boolean
    closeButton?: boolean
    theme?: "light" | "dark" | "system"
    className?: string
  }>
  export const toast: {
    (message: React.ReactNode): void
    success(message: React.ReactNode, options?: any): void
    error(message: React.ReactNode, options?: any): void
    info(message: React.ReactNode, options?: any): void
    warning(message: React.ReactNode, options?: any): void
    dismiss(id?: string | number): void
  }
  const _default: { Toaster: typeof Toaster; toast: typeof toast }
  export default _default
}
