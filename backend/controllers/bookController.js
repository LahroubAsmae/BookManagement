import asyncHandler from "express-async-handler";

//Get books
export const getBooks = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "get books" });
});
//set books
export const setBooks = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ message: "please send a text" });
  }
  res.status(200).json({ message: "set books" });
});
//update books
export const updateBooks = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `update books ${req.params.id}` });
});
//delete books
export const deleteBooks = asyncHandler(async (req, res) => {
  res.status(200).json({ message: `delete book ${req.params.id}` });
});
