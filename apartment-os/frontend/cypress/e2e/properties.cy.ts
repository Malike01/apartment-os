describe("Property Management", () => {
  const uniqueId = Date.now();
  const propertyName = `Cypress Site ${uniqueId}`;

  beforeEach(() => {
    cy.login("admin@test.com", "password123");
  });

  it("should create a new property", () => {
    cy.visit("/properties");

    cy.contains("button", "Yeni Site Ekle").click();

    cy.contains("Yeni Site / Apartman Ekle").should("be.visible");

    cy.get("#name").type(propertyName); // Form item name="name" -> id="name"
    cy.get("#city").type("İzmir");
    cy.get("#address").type("Test Mahallesi 123. Sokak");

    cy.contains("button", "Oluştur").click();

    cy.contains("Site başarıyla oluşturuldu").should("be.visible");
    cy.contains(propertyName).should("be.visible");
  });

  it("should navigate to property detail", () => {
    cy.visit("/properties");

    cy.contains(propertyName).click();

    cy.url().should("include", "/properties/");
    cy.contains(propertyName).should("be.visible");
    cy.contains("Yeni Blok Ekle").should("be.visible");
  });
});
