describe("Authentication Flow", () => {
  const testUser = {
    email: "admin@test.com",
    password: "password123",
  };

  it("should allow user to login with valid credentials", () => {
    cy.visit("/login");

    cy.get("#login_email").type(testUser.email);
    cy.get("#login_password").type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.contains("Giriş başarılı").should("be.visible");

    cy.url().should("include", "/");
    cy.contains("Genel Bakış").should("be.visible");
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/login");

    cy.get("#login_email").type("wrong@user.com");
    cy.get("#login_password").type("wrongpass");
    cy.get('button[type="submit"]').click();

    cy.contains("Giriş yapılamadı").should("be.visible");
  });

  it("should logout successfully", () => {
    cy.login(testUser.email, testUser.password);

    cy.contains("Çıkış Yap").click();

    cy.url().should("include", "/login");
    cy.contains("Tekrar Hoşgeldiniz").should("be.visible");
  });
});
