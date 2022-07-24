import React from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

import { useMutation, useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

import { QUERY_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";

const SavedBooks = () => {
  const { loading, data } = useQuery(QUERY_ME, {
    fetchPolicy: "cache-and-network",
  });

  //   const userData = data?.me.savedBooks;

  console.log("this is userdata", data);

  const [removeBook] = useMutation(REMOVE_BOOK);

  const token = Auth.loggedIn() ? Auth.getToken() : null;
  console.log("this is token", token);

  if (!token) {
    return false;
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log("this is token", token);

    if (!token) {
      return false;
    }
    try {
      const response = await removeBook({ variables: { bookId: bookId } });

      if (!response.ok) {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      console.error(err);
    }
    removeBookId(bookId);
  };

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        {loading ? (
          <h2>Loading books.. </h2>
        ) : (
          <>
            <h2>
              {userData.savedBooks.length
                ? `Viewing ${userData.savedBooks.length} saved ${
                    userData.savedBooks.length === 1 ? "book" : "books"
                  }:`
                : "You have no saved books!"}
            </h2>
            <CardColumns>
              {userData.savedBooks.map((book) => {
                return (
                  <Card key={book.bookId} border="dark">
                    {book.image ? (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    ) : null}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className="small">Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                );
              })}
            </CardColumns>
          </>
        )}
      </Container>
    </>
  );
};

export default SavedBooks;
