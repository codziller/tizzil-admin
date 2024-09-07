import styled from "styled-components";

export const LoadingWrapper = styled.div`
  .content {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    position: relative;
  }
  .loader {
    border: 2.5px solid #e1e1e1; /* Light grey */
    border-top: 2.5px solid #000000; /* Blue */
    border-radius: 50%;
    animation: spin 1s linear infinite;
    ${(props) => {
      switch (props.size) {
        case "tiny":
          return {
            width: "20px",
            height: "20px",
          };
        case "small":
          return {
            width: "60px",
            height: "60px",
          };
        case "medium":
          return {
            width: "100px",
            height: "100px",
          };

        case "large":
          return {
            width: "120px",
            height: "120px",
          };
        default:
          return {
            width: "62px",
            height: "62px",
          };
      }
    }}
  }

  .loader-content {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .icon {
    width: 23px;
    height: 23px;
    margin: auto;
  }

  .loading-text {
    text-align: center;
    color: #65717c;
  }
`;
