// cypress/e2e/authPage

describe("Auth 페이지 테스트", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getDataTest("nav-login-btn").click();
  });

  it("로그인 실패 및 성공 로그아웃 테스트", () => {
    // 로그인 실패 API 응답 모킹
    cy.intercept(
      {
        method: "POST",
        url: "/api/loginForm",
      },
      (req) => {
        req.reply({
          statusCode: 403,
          body: {
            message: "로그인 실패",
          },
        });
      }
    ).as("loginFailRequest");

    cy.getDataTest("loginpage-email-input").within(() => {
      cy.get("input").type("testId@naver.com");
    });

    cy.getDataTest("loginpage-password-input").within(() => {
      cy.get("input").type("wrongpassword");
    });

    cy.getDataTest("loginpage-login-btn").within(() => {
      cy.get("button").click();
    });

    cy.getDataTest("loginpage-password-input").within(() => {
      cy.get("p").contains("비밀번호는");
    });

    cy.getDataTest("loginpage-password-input").within(() => {
      cy.get("input").clear().type("wrongpasswordQ1!");
    });

    cy.getDataTest("loginpage-login-btn").within(() => {
      cy.get("button").click();
    });

    cy.wait("@loginFailRequest");
    cy.getDataTest("loginpage-error").should("be.visible");

    // 로그인 성공 API 응답 모킹
    cy.intercept(
      {
        method: "POST",
        url: "/api/loginForm",
      },
      (req) => {
        req.reply({
          statusCode: 200,
          body: {
            message: "intercept success",
            response: "ok",
            result: {
              // 임시 accessToken 생성
              accessToken:
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ3aF9kbHNnaGtzQG5hdmVyLmNvbSIsImF1dGgiOiJBRE1JTiIsImlkIjo0OCwiY3JlYXRlRGF0ZSI6MTcxODQ5OTc1Mjg2OCwidXNlckltZ1VybCI6Ii9hc3NldHMvaW1hZ2UvY2hhcmFjdGVycy9tMS5wbmciLCJlbWFpbCI6IndoX2Rsc2doa3NAbmF2ZXIuY29tIiwiZXhwIjoxNzIxNzA1Nzk2fQ.iEezMWZt5Wl4Kt_rqbSFYeHoYYBzJZI6CX4QbOJG4gc",
              refreshToken: "temporary_refresh_token",
            },
          },
        });
      }
    ).as("loginSuccessRequest");

    cy.getDataTest("loginpage-password-input").within(() => {
      cy.get("input").clear().type("correcpasswordQ1!");
    });

    cy.getDataTest("loginpage-login-btn").within(() => {
      cy.get("button").click();
    });

    cy.wait("@loginSuccessRequest").then((interception) => {
      if (
        interception &&
        interception.response &&
        interception.response.body &&
        interception.response.body.result
      ) {
        const refreshToken = interception.response.body.result.refreshToken;
        // 쿠키에 refreshToken 설정
        cy.setCookie("refreshToken", refreshToken);
      } else {
        throw new Error("로그인 응답에서 refreshToken을 찾을 수 없습니다.");
      }
    });
    // 로그아웃 API
    cy.intercept(
      {
        method: "GET",
        url: "/api/logout",
      },
      (req) => {
        req.reply({
          statusCode: 200,
          body: {
            message: "로그인 성공",
            response: "OK",
          },
        });
      }
    ).as("logoutRequest");
    cy.getDataTest("navbar-user-image").should("be.visible");

    cy.getDataTest("navbar-user-image").click();
    cy.getDataTest("main-logout-btn").click();
    cy.getDataTest("main-logout-no").click(); 

    cy.getDataTest("main-logout-btn").click();
    cy.getDataTest("main-logout-yes").click();

    cy.wait("@logoutRequest").then(() => {
      // 쿠키 삭제 확인
      cy.clearCookie('accessToken');
      cy.clearCookie('refreshToken');
    });
    cy.getDataTest("nav-login-btn").should("be.visible");
  });
});
