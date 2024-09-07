import styled from "styled-components";

export const OnboardingDefaultWrapper = styled.div`
  padding: 48px;

  .bani-logo-container {
    margin-bottom: 45px;
    @media (max-width: 532px) {
      margin-bottom: 32px;
    }
    .bani-logo {
      width: 89.26px;
      height: 28px;
    }
  }

  .default-content {
    margin: 0 auto;
    width: 362px;
  }

  .form-container {
    .section-heading {
      font-weight: 500;
      line-height: 35px;
    }
    .form-container-desc {
      font-size: 16px;
      line-height: 18px;
      margin-bottom: 32px;
    }
  }
  @media (max-width: 532px) {
    .form-container .section-heading {
      margin-bottom: 28px;
      font-size: 20px;
    }
    .form-container .form-container-desc {
      font-size: 14px;
    }
    padding-left: 12px;
    padding-right: 12px;
    .default-content {
      width: auto;
    }
  }
`;
