import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getGiftCardsQuery = ({ page }) => gql`
  {
    __typename
    getGiftCardCategoryDesigns(
        pageNumber: "${page}",
    ){
        total,
        results{
            cardCategory,
            cardDesign,
            createdAt,
            id
        }
    }
  }
`;

const createGiftCardQuery = gql`
  mutation createGiftCardCategoryDesign(
    $cardCategory: GIFTCARD_CATEGORY!
    $cardDesign: String!
  ) {
    createGiftCardCategoryDesign(
      cardCategory: $cardCategory
      cardDesign: $cardDesign
    ) {
      id
    }
  }
`;

const deleteGiftCardQuery = gql`
  mutation deleteGiftCardCategoryDesign($id: String!) {
    deleteGiftCardCategoryDesign(id: $id) {
      status
    }
  }
`;

const apis = {
  getGiftCards: ({ page }) =>
    graphQlInstance(getGiftCardsQuery({ page }), {
      method: "GET",
    }),

  createGiftCard: (variables) =>
    graphQlInstance(createGiftCardQuery, {
      variables,
    }),

  deleteGiftCard: (variables) =>
    graphQlInstance(deleteGiftCardQuery, {
      variables,
    }),
};

export default apis;
