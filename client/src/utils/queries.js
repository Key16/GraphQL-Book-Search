import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      password
      bookCount
      savedBooks {
        _id
        bookdId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
