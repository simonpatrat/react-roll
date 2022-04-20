export interface ControlButtonProps {
  label: string;
  direction: "previous" | "next";
  onClick: () => void;
  ariaLabel?: string;
  buttonType?: "text" | "icon";
  disabled?: boolean;
}
