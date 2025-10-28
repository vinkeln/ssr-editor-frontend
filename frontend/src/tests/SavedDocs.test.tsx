import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SavedDocs from "../pages/SavedDocs";

const getDocumentsMock = vi.fn();
const deleteDocumentMock = vi.fn();

vi.mock("../hooks/documentStorage", () => ({
  useDocumentStorage: () => ({
    getDocuments: getDocumentsMock,
    deleteDocument: deleteDocumentMock,
  }),
}));

const mockDocs = [
  {
    id: "1",
    title: "Test Doc",
    content: "<p>Test content</p>",
    createdAt: "2025-01-01T12:00:00Z",
    userId: "user1",
  },
];

describe("SavedDocs integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Renders 'No documents saved.' if the list is empty", async () => {
    getDocumentsMock.mockResolvedValueOnce({ owned: [], shared: [], total: 0 });
    render(
      <BrowserRouter>
        <SavedDocs />
      </BrowserRouter>
    );
    await waitFor(() =>
      expect(screen.getByText("No documents saved.")).toBeInTheDocument()
    );
  });

  it("Renders document from the list", async () => {
    getDocumentsMock.mockResolvedValueOnce({
      owned: mockDocs,
      shared: [],
      total: 1
    });
    render(
      <BrowserRouter>
        <SavedDocs />
      </BrowserRouter>
    );
    await waitFor(() =>
      expect(screen.getByText("Test Doc")).toBeInTheDocument()
    );
  });

  it("Remove document", async () => {
    getDocumentsMock.mockResolvedValueOnce({
      owned: mockDocs,
      shared: [],
      total: 1
    });
    deleteDocumentMock.mockResolvedValueOnce(true);

    render(
      <BrowserRouter>
        <SavedDocs />
      </BrowserRouter>
    );
    await waitFor(() =>
      expect(screen.getByText("Test Doc")).toBeInTheDocument()
    );
    const deleteBtn = screen.getByText("X");
    fireEvent.click(deleteBtn);
  });
});