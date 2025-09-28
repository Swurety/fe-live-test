import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../LoginForm";
import { login } from "../../api/auth";

jest.mock("../../api/auth", () => ({
  login: jest.fn(),
}));

test("shows welcome on successful login", async () => {
  (login as jest.Mock).mockResolvedValueOnce({});
  render(<LoginForm />);

  const user = userEvent.setup();

  await user.type(screen.getByLabelText(/username/i), "admin");
  await user.type(screen.getByLabelText(/password/i), "secret");
  await user.click(screen.getByRole("button", { name: /log in/i }));

  expect(await screen.findByText(/welcome, admin/i)).toBeInTheDocument();
});
