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

const getAllGiftCardsQuery = ({ page, startDate, endDate, search }) => gql`
  query{
      allActiveGiftCards(
          startDate: "${startDate}",
          endDate: "${endDate}",
          pageNumber: "${page}",
          searchQuery: "${search}"
      ){
          results{
              id,
              sender{
                  email
              },
              receiverEmail,
              cardCategory,
              cardDesign,
              cardCode,
              createdAt,
              currentBalance,
              initialAmount
          }
          total
      }
  }
`;

const getGiftCardActivitiesQuery = ({ page, card_id }) => gql`
  query{
      getGiftCardActivity(
          input: {
              pageNumber: "${page}",
              giftCardId: "${card_id}"
          }
      ){
          results{
              amount,
              createdAt,
              description,
              giftCardCode,
              giftCardId,
              orderCode,
              paymentMethod,
              
          }
          total
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

const getGiftCardStatsQuery = ({ startDate, endDate }) => gql`
  {
    __typename
    getGiftCardStats(
        input: {
            endDate: "${endDate}",
            startDate: "${startDate}"
        }
    ){
        totalAmount,
        totalCreated,
        totalTopUpAmount,
        totalTopUps,
        avgInitialAmount,
        avgTopUpAmount,
    }
  }
`;

const verifyGiftCardQuery = ({ code }) => gql`
  query{
    verifyGiftCard(
        cardCode: "${code}"
    ){
      id,
      cardDesign,
      currentBalance,
      receiverName,
      receiverEmail,
      createdAt,
      currentBalance,
      initialAmount,
      message,
    }
  }
`;

const apis = {
  getGiftCards: ({ page }) =>
    graphQlInstance(getGiftCardsQuery({ page }), {
      method: "GET",
    }),
  getAllGiftCards: ({ page, startDate, endDate, search }) =>
    graphQlInstance(
      getAllGiftCardsQuery({ page, startDate, endDate, search }),
      {
        method: "GET",
      }
    ),
  getGiftCardActivities: ({ page, card_id }) =>
    graphQlInstance(getGiftCardActivitiesQuery({ page, card_id }), {
      method: "GET",
    }),
  verifyGiftCard: ({ code }) =>
    graphQlInstance(verifyGiftCardQuery({ code }), {
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
  getGiftCardStats: ({ startDate, endDate }) =>
    graphQlInstance(getGiftCardStatsQuery({ startDate, endDate }), {
      method: "GET",
    }),
};

export default apis;
