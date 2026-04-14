// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SDG_CATEGORIES, SDG_CATEGORY_LABELS } from "@/types/enums";

const mockFormAction = vi.fn();
let mockFormState = { error: null as string | null };
let mockPending = false;

vi.mock("react-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-dom")>();
  return {
    ...actual,
    useFormState: () => [mockFormState, mockFormAction],
    useFormStatus: () => ({ pending: mockPending }),
  };
});

vi.mock("@/app/(platform)/problems/actions", () => ({
  createProblemAction: vi.fn(),
}));

import { ProblemForm } from "./problem-form";

beforeEach(() => {
  cleanup();
  mockFormState = { error: null };
  mockPending = false;
});

describe("ProblemForm", () => {
  it("renders all form fields with labels", () => {
    const { container } = render(<ProblemForm />);

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("GitHub Repository URL")).toBeInTheDocument();
    // Category label exists, but z-select is non-labellable in jsdom
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(container.querySelector('input[name="category"]')).toBeInTheDocument();
    expect(screen.getByLabelText("Tags (comma-separated)")).toBeInTheDocument();
  });

  it("renders all SDG category options", () => {
    const { container } = render(<ProblemForm />);

    // The mounted Select renders options as div[data-value] elements
    for (const cat of SDG_CATEGORIES) {
      const option = container.querySelector(`[data-value="${cat}"]`);
      expect(option).toBeInTheDocument();
      expect(option).toHaveTextContent(SDG_CATEGORY_LABELS[cat]);
    }
  });

  it("renders submit button with correct text", () => {
    render(<ProblemForm />);

    // Filter to type="submit" to avoid the Select trigger button
    const buttons = screen.getAllByRole("button");
    const submitButton = buttons.find((b) => b.getAttribute("type") === "submit");
    expect(submitButton).toBeDefined();
    expect(submitButton).toHaveTextContent("Create Problem");
    expect(submitButton).not.toBeDisabled();
  });

  it("shows error banner when state has error", () => {
    mockFormState = { error: "Must be signed in to create a problem" };
    render(<ProblemForm />);

    expect(
      screen.getByText("Must be signed in to create a problem")
    ).toBeInTheDocument();
  });

  it("hides error banner when state.error is null", () => {
    render(<ProblemForm />);

    const errorBanner = document.querySelector(".bg-red-900\\/50");
    expect(errorBanner).not.toBeInTheDocument();
  });

  it("shows 'Creating...' and disables button when pending", () => {
    mockPending = true;
    render(<ProblemForm />);

    const buttons = screen.getAllByRole("button");
    const submitButton = buttons.find((b) => b.getAttribute("type") === "submit");
    expect(submitButton).toBeDefined();
    expect(submitButton).toHaveTextContent("Creating...");
    expect(submitButton).toBeDisabled();
  });

  it("has correct field names for FormData", () => {
    const { container } = render(<ProblemForm />);

    expect(screen.getByLabelText("Title")).toHaveAttribute("name", "title");
    expect(screen.getByLabelText("Description")).toHaveAttribute(
      "name",
      "description"
    );
    expect(screen.getByLabelText("GitHub Repository URL")).toHaveAttribute(
      "name",
      "repoUrl"
    );
    expect(screen.getByLabelText("Tags (comma-separated)")).toHaveAttribute(
      "name",
      "tags"
    );
    // Category uses a hidden input with name="category" in the mounted z-select path
    expect(container.querySelector('input[name="category"]')).toBeInTheDocument();
  });
});
