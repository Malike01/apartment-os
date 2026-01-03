import { screen, waitFor } from "@testing-library/react";
import { render } from "../../../test/utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { propertyService } from "../../api/services/propertyService";
import { createMockProperty } from "../../../test/factories/propertyFactory";
import Properties from ".";

vi.mock("../../api/services/propertyService");

describe("Properties Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render property cards when data exists", async () => {
    // 1. ARRANGE
    const mockProperties = [
      createMockProperty({ name: "Zümrüt Sitesi" }),
      createMockProperty({ name: "Safir Apartmanı" }),
    ];

    (propertyService.getAll as any).mockResolvedValue(mockProperties);

    // 2. ACT
    render(<Properties />);

    // 3. ASSERT
    await waitFor(() => {
      expect(screen.getByText("Zümrüt Sitesi")).toBeInTheDocument();
      expect(screen.getByText("Safir Apartmanı")).toBeInTheDocument();
      expect(screen.getByText(/Blok/)).toBeInTheDocument();
    });
  });
});
