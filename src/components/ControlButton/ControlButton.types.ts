export interface ControlButtonProps {
  label: string;
  direction: "previous" | "next";
  onClick: () => void;
  onMouseEnter?: () => void;
  onTouchStart?: () => void;
  ariaLabel?: string;
  buttonType?: "text" | "icon";
  disabled?: boolean;
}
