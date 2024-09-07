import { gql } from "graphql-request";
import { graphQlInstance } from "services";

const getBlogQuery = ({ id }) => gql`
  {
    __typename
    blogArticle(id: "${id}") {
      
      archive
      authorsName
      bannerImageUrl
      blogArticleShares{
        id
        userId
      }
      blogArticleViews{
        id
        userId
      }
      brands{
        id
        brandName
      }
      categories {
        id
        name
      }
      creatorId
      id
      post
      postImageUrl
      publishDate
      subHeader
      title
      updatedAt
    }
  }
`;
const getBlogsQuery = ({ page, isPublished, brandIds, categoryIds }) => gql`
  {
    __typename
    blogArticles_by_page_number(pageNumber: ${page}, 
      isPublished: ${isPublished},
      brandIds: ${brandIds},
      categoryIds: ${categoryIds}) {
      total
      results {
        archive
        authorsName
        bannerImageUrl
        blogArticleShares{
          id
          userId
        }
        blogArticleViews{
          id
          userId
        }
        brands{
          id
          brandName
        }
        categories {
          id
          name
        }
        creatorId
        id
        post
        postImageUrl
        publishDate
        subHeader
        title
        updatedAt
      }
    }
  }
`;

const getArchivedBlogsQuery = ({ page }) => gql`
  {
    __typename
    blogArticles_archived_by_page_number(pageNumber: ${page} 
     ) {
      total
      results {
        archive
        authorsName
        bannerImageUrl
        blogArticleShares{
          id
          userId
        }
        blogArticleViews{
          id
          userId
        }
        brands{
          id
          brandName
        }
        categories {
          id
          name
        }
        creatorId
        id
        post
        postImageUrl
        publishDate
        subHeader
        title
        updatedAt
      }
    }
  }
`;

const searchBlogsQuery = ({ page, searchQuery }) => gql`
  {
    __typename
    blogArticles_search_by_page_number(pageNumber: ${page}, searchQuery: "${searchQuery}") {
      total
      results {
        archive
        authorsName
        bannerImageUrl
        blogArticleShares{
          id
          userId
        }
        blogArticleViews{
          id
          userId
        }
        brands{
          id
          brandName
        }
        categories {
          id
        }
        creatorId
        id
        post
        postImageUrl
        publishDate
        subHeader
        title
        updatedAt
      }
    }
  }
`;

const createBlogQuery = gql`
  mutation createBlogArticle(
    $authorsName: String!
    $bannerImageUrl: String!
    $brandIds: [String!]
    $categoryIds: [String!]!
    $post: String!
    $postImageUrl: String!
    $publishDate: DateTime!
    $subHeader: String!
    $title: String!
  ) {
    createBlogArticle(
      createBlogArticleInput: {
        authorsName: $authorsName
        bannerImageUrl: $bannerImageUrl
        brandIds: $brandIds
        categoryIds: $categoryIds
        post: $post
        postImageUrl: $postImageUrl
        publishDate: $publishDate
        subHeader: $subHeader
        title: $title
      }
    ) {
      id
    }
  }
`;

const editBlogQuery = gql`
  mutation updateBlogArticle(
    $authorsName: String!
    $bannerImageUrl: String!
    $brandIds: [String!]
    $categoryIds: [String!]!
    $post: String!
    $postImageUrl: String!
    $publishDate: DateTime!
    $subHeader: String!
    $title: String!
    $blogArticleId: String!
  ) {
    updateBlogArticle(
      updateBlogArticleInput: {
        authorsName: $authorsName
        bannerImageUrl: $bannerImageUrl
        brandIds: $brandIds
        categoryIds: $categoryIds
        post: $post
        postImageUrl: $postImageUrl
        publishDate: $publishDate
        subHeader: $subHeader
        title: $title
        blogArticleId: $blogArticleId
      }
    ) {
      id
    }
  }
`;

const editBlogWalletQuery = gql`
  mutation adjustBlogBalance(
    $amount: Float!
    $transactionType: TRANSACTION_TYPE!
    $staffId: String!
  ) {
    adjustBlogBalance(
      amount: $amount
      transactionType: $transactionType
      staffId: $staffId
    ) {
      id
    }
  }
`;

const deleteBlogQuery = gql`
  mutation updateBlogArticleArchiveStatus($id: String!, $archive: Boolean!) {
    updateBlogArticleArchiveStatus(id: $id, archive: $archive) {
      id
    }
  }
`;

const apis = {
  getBlogs: ({ page, isPublished, brandIds, categoryIds }) =>
    graphQlInstance(
      getBlogsQuery({ page, isPublished, brandIds, categoryIds }),
      {
        method: "GET",
      }
    ),
  getArchivedBlogs: ({ page }) =>
    graphQlInstance(getArchivedBlogsQuery({ page }), {
      method: "GET",
    }),
  searchBlogs: ({ page, searchQuery }) =>
    graphQlInstance(searchBlogsQuery({ page, searchQuery }), {
      method: "GET",
    }),
  getBlog: ({ id }) =>
    graphQlInstance(getBlogQuery({ id }), {
      method: "GET",
    }),

  createBlog: (variables) =>
    graphQlInstance(createBlogQuery, {
      variables,
    }),

  editBlog: (variables) =>
    graphQlInstance(editBlogQuery, {
      variables,
    }),

  editBlogWallet: (variables) =>
    graphQlInstance(editBlogWalletQuery, {
      variables,
    }),

  deleteBlog: (variables) =>
    graphQlInstance(deleteBlogQuery, {
      variables,
    }),
};

export default apis;
