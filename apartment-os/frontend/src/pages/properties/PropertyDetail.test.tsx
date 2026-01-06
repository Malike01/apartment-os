import { screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PropertyDetail from "./PropertyDetail";
import { propertyService } from "../../api/services/propertyService";
import { inventoryService } from "../../api/services/inventoryService";
import { render } from "@/test/utils";
import { createMockProperty } from "@/test/factories/propertyFactory";
import { createMockBlock } from "@/test/factories/inventoryFactory";

vi.mock("../../api/services/propertyService");
vi.mock("../../api/services/inventoryService");

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "123" }), // URL: /properties/123
    useNavigate: () => vi.fn(),
  };
});

describe("PropertyDetail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render property details and blocks tabs", async () => {
    // 1. ARRANGE
    const mockProperty = createMockProperty({ id: "123", name: "Elit Sitesi" });
    const mockBlocks = [
      createMockBlock({ name: "A Blok", propertyId: "123" }),
      createMockBlock({ name: "B Blok", propertyId: "123" }),
    ];

    (propertyService.getById as any).mockResolvedValue(mockProperty);
    (inventoryService.getBlocksByProperty as any).mockResolvedValue(mockBlocks);
    (inventoryService.getUnitsByBlock as any).mockResolvedValue([]);

    // 2. ACT
    render(<PropertyDetail />);

    // 3. ASSERT
    await waitFor(() => {
      expect(screen.getByText("Elit Sitesi")).toBeInTheDocument();
    });

    expect(screen.getByText(/A Blok/)).toBeInTheDocument();
    expect(screen.getByText(/B Blok/)).toBeInTheDocument();
  });

  it('should open "New Block" modal when button clicked', async () => {
    // ARRANGE
    (propertyService.getById as any).mockResolvedValue(createMockProperty());
    (inventoryService.getBlocksByProperty as any).mockResolvedValue([]);

    render(<PropertyDetail />);
    await waitFor(() => screen.getByText("Yeni Blok Ekle"));

    // ACT
    fireEvent.click(screen.getByText("Yeni Blok Ekle"));

    // ASSERT
    await waitFor(() => {
      expect(
        screen.getByText("Yeni Blok Ekle", { selector: ".ant-modal-title" })
      ).toBeInTheDocument();
    });
  });
});
