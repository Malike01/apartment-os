// Her test dosyasından önce çalışır
beforeEach(() => {
  cy.request("DELETE", "http://localhost:3000/testing/reset-db");
});
