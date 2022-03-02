import React from "react";
import { ControlButtonProps } from "./ControlButton.types";

const ControlButton = ({ label, ariaLabel, onClick }: ControlButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className="r-r__button r-r__buton--previous"
    >
      {label}
    </button>
  );
};

export default ControlButton;
