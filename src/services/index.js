/* eslint-disable dot-notation */
import { GraphQLClient } from "graphql-request";
import { getToken } from "utils/storage";
import { errorToast } from "components/General/Toast/Toast";

export async function graphQlInstance(doc, { method, variables, jwt }) {
  const token = getToken() || jwt;

  const mainInstance = async () => {
    const baseUrl = String(process.env.REACT_APP_BASE_URL);
    const graphQLClient = new GraphQLClient(baseUrl, {
      ...(method && { method }),
      headers: {
        ...(token && { authorization: `Bearer ${token}` }),
      },
    });

    try {
      const data = await graphQLClient.request(doc, variables);
      return data;
    } catch (error) {
      const errorMesage =
        error?.response?.errors[0]?.message || "Error encountered!";
      errorToast(errorMesage);
      throw errorMesage;
    }
  };

  return mainInstance().catch(async (err) => await Promise.reject(err));
}
