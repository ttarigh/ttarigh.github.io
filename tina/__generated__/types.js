export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const ArtPartsFragmentDoc = gql`
    fragment ArtParts on Art {
  __typename
  artProjects {
    __typename
    id
    title
    category
    year
    description
    body
    link
    linkText
    previewImage
    images
  }
}
    `;
export const WorkPartsFragmentDoc = gql`
    fragment WorkParts on Work {
  __typename
  workProjects {
    __typename
    id
    title
    category
    year
    description
    images {
      __typename
      src
      alt
    }
    imageLayout
  }
}
    `;
export const AboutPartsFragmentDoc = gql`
    fragment AboutParts on About {
  __typename
  title
  image
  intro
  bio
  contact
  arenaBox {
    __typename
    title
    description
    link
  }
  philosophy
  footer
}
    `;
export const ArtDocument = gql`
    query art($relativePath: String!) {
  art(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ArtParts
  }
}
    ${ArtPartsFragmentDoc}`;
export const ArtConnectionDocument = gql`
    query artConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ArtFilter) {
  artConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ArtParts
      }
    }
  }
}
    ${ArtPartsFragmentDoc}`;
export const WorkDocument = gql`
    query work($relativePath: String!) {
  work(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...WorkParts
  }
}
    ${WorkPartsFragmentDoc}`;
export const WorkConnectionDocument = gql`
    query workConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: WorkFilter) {
  workConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...WorkParts
      }
    }
  }
}
    ${WorkPartsFragmentDoc}`;
export const AboutDocument = gql`
    query about($relativePath: String!) {
  about(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...AboutParts
  }
}
    ${AboutPartsFragmentDoc}`;
export const AboutConnectionDocument = gql`
    query aboutConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: AboutFilter) {
  aboutConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...AboutParts
      }
    }
  }
}
    ${AboutPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    art(variables, options) {
      return requester(ArtDocument, variables, options);
    },
    artConnection(variables, options) {
      return requester(ArtConnectionDocument, variables, options);
    },
    work(variables, options) {
      return requester(WorkDocument, variables, options);
    },
    workConnection(variables, options) {
      return requester(WorkConnectionDocument, variables, options);
    },
    about(variables, options) {
      return requester(AboutDocument, variables, options);
    },
    aboutConnection(variables, options) {
      return requester(AboutConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/1.6/content/1b05e708-d9d0-4fd7-83ac-3ecf5ec12662/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
