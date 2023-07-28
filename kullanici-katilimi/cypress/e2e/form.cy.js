//"sayfa sorunsuz render oluyor"

//"gönder butonu başta disabled"

//"form başarıyla gönderiliyor"

describe("Form with YUP validation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("sayfa sorunsuz render oluyor", () => {
    cy.get("input[name='name']").should("exist");
    cy.get("input[name='email']").should("exist");
    cy.get("input[name='pass']").should("exist");
    cy.get("input[name='terms']").should("exist");
    cy.get("button[type='submit']").should("exist");

    //üsttekinin alternatifi
    cy.get("input").should("have.length", 4);
    cy.get("button[type='submit']").should("have.length", 1);
  });

  it("gönder butonu başta disabled", () => {
    cy.get("[data-testid='submit']").should("be.disabled");
  });

  const passingFormData = {
    name: "John Doe",
    email: "john@wit.com.tr",
    pass: "123456A",
    terms: true,
  };

  const failingFormData = {
    name: "Jo",
    email: "johnwit",
    pass: "123",
    terms: false,
  };

  it("form başarıyla gönderiliyor", () => {
    const fname = cy.get("input[name='name']");
    const femail = cy.get("input[name='email']");
    const fpass = cy.get("input[name='pass']");
    const fterms = cy.get("input[name='terms']");

    fname.type(passingFormData.name);
    femail.type(passingFormData.email);
    fpass.type(passingFormData.pass);
    fterms.check();

    cy.get("[data-testid='submit']").should("not.be.disabled");
    cy.get("[data-testid='submit']").click();

    cy.get("ul li")
      .should("have.length", 1)
      .last()
      .should("have.text", passingFormData.name);
  });

  it("yup validation çalışıyor ", () => {
    const fname = cy.get("input[name='name']");
    const femail = cy.get("input[name='email']");
    const fpass = cy.get("input[name='pass']");
    const fterms = cy.get("input[name='terms']");

    fname.type(failingFormData.name);
    femail.type(failingFormData.email);
    fpass.type(failingFormData.pass);
    fterms.dblclick();

    const errorMessages = cy.get(".error");
    errorMessages.should("have.length", 4);

    cy.get(".error").eq(0).should("have.text", "İsim en az 3 karakter olmalı.");

    errorMessages.eq(1).should("have.text", "Güvercin seni böyle bulamaz");
    cy.get(".error")
      .eq(2)
      .should(
        "have.text",
        "Şifre en az 7 karakter olmalı ve sadece sayı olmamalı"
      );
    cy.get(".error").eq(3).should("have.text", "Kabul etmek zorunlu");
  });
});
