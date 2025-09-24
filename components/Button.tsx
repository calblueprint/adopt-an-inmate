import { forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }) => {
  return <button {...props}>{children}</button>;
});
Button.displayName = "Button";
