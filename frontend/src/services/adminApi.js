import { BASE_URL, handleResponse } from "./api";

export const adminApi = {
  // Gestion des livres
  getBooks: () => fetch(`${BASE_URL}/api/books`).then(handleResponse),

  createBook: (bookData) =>
    fetch(`${BASE_URL}/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(bookData),
    }).then(handleResponse),

  updateBook: (id, updates) =>
    fetch(`${BASE_URL}/api/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updates),
    }).then(handleResponse),

  deleteBook: (id) =>
    fetch(`${BASE_URL}/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(handleResponse),

  // Gestion des emprunts
  getAllBorrowings: () =>
    fetch(`${BASE_URL}/api/borrowings`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(handleResponse),

  forceReturn: (borrowingId) =>
    fetch(`${BASE_URL}/api/borrowings/${borrowingId}/return`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then(handleResponse),
};
