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
}: ControlButtonProps) => {
  const buttonClassNames = cls([
    "r-r__button",
    `r-r__button--${direction === "next" ? "next" : "previous"}`,
    buttonType === "icon" && "r-r__button--with-icon",
  ]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={buttonClassNames}
    >
      {buttonType === "icon" ? <IconChevron /> : label}
    </button>
  );
};

export default ControlButton;
