describe("Finance Global State", () => {
  beforeEach(() => {
    cy.login("admin@test.com", "password123");
  });

  it("should persist selected property across page reloads", () => {
    cy.visit("/finance");

    cy.get(".ant-select-selector").click();

    cy.get(".ant-select-item-option").eq(0).click();

    cy.get(".ant-select-selection-item")
      .invoke("text")
      .then((selectedText) => {
        cy.reload();

        cy.get(".ant-select-selection-item").should("have.text", selectedText);
      });
  });

  it("should persist selected property when navigating away and back", () => {
    cy.visit("/finance");

    cy.get(".ant-select-selector").click();
    cy.get(".ant-select-item-option").last().click();

    cy.get(".ant-select-selection-item")
      .invoke("text")
      .then((selectedText) => {
        cy.get('a[href="/"]').click();
        cy.contains("Genel Bakış").should("be.visible");

        cy.get('a[href="/finance"]').click();

        cy.get(".ant-select-selection-item").should("have.text", selectedText);
      });
  });
});
