import styled, { css } from "styled-components";
import { P2 } from "@/styles/text";

interface ButtonProps {
  $primaryColor?: string;
  $secondaryColor?: string;
  $width?: string;
}

/* shared ButtonStyles for all buttons
Must provide either primaryColor or secondaryColor, or both. 

If primaryColor provided, 
- Fill (background): primaryColor
- Text: secondaryColor (or white)
- Border: none 
If primaryColor not provided,
- Fill (background): transparent
- Text: secondaryColor 
- Border: secondaryColor

If both provided, it will be a primaryColor button with secondaryColor text
*/

// Adjust default styles as needed
const ButtonStyles = css<ButtonProps>`
  font-family: inherit;
  border: 0.5px solid;
  border-color: ${({ $secondaryColor, $primaryColor }) =>
    $primaryColor ? "transparent" : $secondaryColor || "white"};
  background: ${({ $primaryColor }) => $primaryColor || "transparent"};
  color: ${({ $primaryColor, $secondaryColor }) =>
    $primaryColor ? "white" : $secondaryColor};

  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  &:hover {
    cursor: pointer;
    /* background-color: ${({ $primaryColor, $secondaryColor }) =>
      $primaryColor ? $primaryColor : $secondaryColor};
    color: ${({ $primaryColor, $secondaryColor }) =>
      $primaryColor ? $secondaryColor : "white"};
    border-color: ${({ $secondaryColor }) => $secondaryColor}; */
  }

  &:disabled {
    background: "gray";
    border-color: "gray";
    cursor: not-allowed;
  }
`;

export const Button = styled(P2).attrs({ as: "button" })<ButtonProps>`
  ${ButtonStyles}

  width: ${({ $width }) => $width || "156px"};
  height: 44px;
  border-radius: 44px;
`;

export const BigButton = styled(Button)<ButtonProps>`
  width: 100%;
`;
