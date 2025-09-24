import React from "react";
import { IconSvgs, IconType } from "@/lib/icons";

interface IconProps {
  className?: string;
  type: IconType;
}

// Use this as a Styled Component to render custom icons
// If an icon is available from react-icons or Radix, use that instead of this component
const Icon = ({ className, type }: IconProps) =>
  React.cloneElement(IconSvgs[type], {
    className,
  });

export default Icon;
