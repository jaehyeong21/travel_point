describe("메인페이지 600이하 테스트", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("폰사이즈 테스트", () => {
    beforeEach(() => {
      cy.viewport("iphone-x");
    });
    it("UI 테스트", () => {
      // 로고 체크
      cy.getDataTest("logo").should("be.visible");
      // 모바일용 검색 버튼 체크
      cy.getDataTest("search-btn").should("not.be.visible");
      cy.getDataTest("smallView-search-btn").should("be.visible");
    });
    it("기능 테스트", () => {
      const nextPageTest = (region: string, pageIndex: number) => {
        cy.getDataTest(`main-${region}-${pageIndex}`).should("be.visible");
        cy.getDataTest(`next-btn-${region}`).click();
      };

      const testRegion = (region: string) => {
        const pageCount = 5;
        for (let i = 0; i < pageCount; i++) {
          nextPageTest(region, i);
        }
        cy.getDataTest(`main-${region}-0`).should("be.visible");
      };

      const testTheme = (theme: string) => {
        cy.getDataTest(`main-${theme}-card-0`).should("be.visible");
        cy.getDataTest(`main-${theme}-card-2`).should("not.be.visible");
        cy.getDataTest(`main-${theme}-btn-1`).click();
        cy.getDataTest(`main-${theme}-card-2`).should("be.visible");
        cy.getDataTest(`main-${theme}-btn-2`).click();
        cy.getDataTest(`main-${theme}-card-4`).should("be.visible");
        cy.getDataTest(`main-${theme}-btn-3`).click();
        cy.getDataTest(`main-${theme}-card-6`).should("be.visible");
        cy.getDataTest(`main-${theme}-btn-0`).click();
        cy.getDataTest(`main-${theme}-card-0`).should("be.visible");
      };

      // 지역 테스트
      testRegion("서울");
      testRegion("울산");

      // 테마 테스트
      testTheme("역사");
      testTheme("힐링");

      //축제 테스트
      cy.getDataTest(`festival-card-0`).should('be.visible');
      cy.getDataTest(`festival-next-btn`).click();
      cy.getDataTest(`festival-card-2`).should('be.visible');
      cy.getDataTest(`festival-card-0`).should('not.be.visible');
      cy.getDataTest(`festival-prev-btn`).click();
      cy.getDataTest(`festival-card-2`).should('not.be.visible');
    });
  });

  context("데스크탑 화면 테스트", () => {
    beforeEach(() => {
      cy.viewport("macbook-16");
    });
    it("UI 테스트", () => {
      cy.getDataTest("logo").should("be.visible");
      cy.getDataTest("search-btn").should("be.visible");
      cy.getDataTest("smallView-search-btn").should("not.be.visible");
    });

    it("기능 테스트", () => {
      const nextPageTest = (region: string, pageIndex: number) => {
        cy.getDataTest(`main-${region}-${pageIndex}`).should("be.visible");
        cy.getDataTest(`next-btn-${region}`).click();
      };

      const testRegion = (region: string) => {
        const pageCount = 5;
        for (let i = 0; i < pageCount; i++) {
          nextPageTest(region, i);
        }
        cy.getDataTest(`main-${region}-0`).should("be.visible");
      };

      const testTheme = (theme: string) => {
        cy.getDataTest(`main-${theme}-card-0`).should("be.visible");
        cy.getDataTest(`main-${theme}-card-2`).should("not.be.visible");
        cy.getDataTest(`main-${theme}-btn-1`).click();
        cy.getDataTest(`main-${theme}-card-2`).should("be.visible");
        cy.getDataTest(`main-${theme}-btn-2`).click();
        cy.getDataTest(`main-${theme}-card-4`).should("be.visible");
        cy.getDataTest(`main-${theme}-btn-3`).click();
        cy.getDataTest(`main-${theme}-card-6`).should("be.visible");
        cy.getDataTest(`main-${theme}-btn-0`).click();
        cy.getDataTest(`main-${theme}-card-0`).should("be.visible");
      };

      // 지역 테스트
      testRegion("서울");
      testRegion("울산");

      // 테마 테스트
      testTheme("역사");
      testTheme("힐링");

      //축제 테스트
      cy.getDataTest(`festival-card-0`).should('be.visible');
      cy.getDataTest(`festival-next-btn`).click();
      cy.getDataTest(`festival-card-5`).should('be.visible');
      cy.getDataTest(`festival-card-0`).should('not.be.visible');
      cy.getDataTest(`festival-prev-btn`).click();
      cy.getDataTest(`festival-card-5`).should('not.be.visible');
    });
  });
});
