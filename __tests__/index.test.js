import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "../pages/index";

// supabaseのauthをモック
jest.mock("lib/Store", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

describe("Home (Login) page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ログイン成功時にhandleLoginが呼ばれ、エラーが出ない", async () => {
    const { supabase } = require("lib/Store");
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
      data: { user: { id: 1, email: "test@example.com" } },
    });

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText("Your Username"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("ログイン失敗時にアラートが表示される", async () => {
    const { supabase } = require("lib/Store");
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login" },
      data: { user: null },
    });

    window.alert = jest.fn();

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText("Your Username"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Error with auth: Invalid login");
    });
  });
});
