import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ControlButton from "./ControlButton";

describe("ControlButton", () => {
  it("should trigger a click handler when user clicks on button", async () => {
    const handleClickMock = jest.fn();

    await render(<ControlButton label="Hello" onClick={handleClickMock} />);

    userEvent.click(screen.getByText("Hello"));

    expect(handleClickMock).toHaveBeenCalled();
  });
});
