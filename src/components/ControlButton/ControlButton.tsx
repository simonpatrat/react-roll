import React from "react";
import { cls } from "../../lib/utils";
import { ControlButtonProps } from "./ControlButton.types";
import IconChevron from "./IconChevron";

const ControlButton = ({
  label,
  direction,
  ariaLabel,
  onClick,
  buttonType = "icon",
  disabled = false,
  onMouseEnter,
  onTouchStart,
}: ControlButtonProps) => {
  const buttonClassNames = cls([
    "r-r__button",
    `r-r__button--${direction === "next" ? "next" : "previous"}`,
    buttonType === "icon" && "r-r__button--with-icon",
  ]);

  return (
    <button
      type="button"
      role="button"
      tabIndex={0}
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={buttonClassNames}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      {...(disabled && { disabled: true })}
    >
      {buttonType === "icon" ? <IconChevron /> : label}
    </button>
  );
};

export default ControlButton;
