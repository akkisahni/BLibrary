const express = require('express');
const bookRoute = express.Router();
const {check, validationResult} = require('express-validator');
const request = require('request');
const auth = require('../../middleware/auth');
const Book = require('../../models/Book');

//@route   GET api/book
//@desc    Get all the books   
//@access  Public
bookRoute.route('/')
.get(async (req, res) => {
    try{
        const books = await Book.find({});
        res.status(200).json(books);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
});

// @route    GET api/books/:id
// @desc     Get book by ID
// @access   Private
bookRoute.get('/:id', auth, async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
  
      if (!book) {
        return res.status(404).json({ msg: 'Book not found' });
      }
  
      res.json(book);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Book not found' });
      }
      res.status(500).send('Server Error');
    }
  });


//@route   POST api/book
//@desc    Add a book to the DB
//@access  Private
bookRoute.post('/', [auth,
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('ISBN', 'ISBN number  is required')
    .not()
    .isEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        let {
            title,
            description,
            author,
            ISBN,
            genre,
            coverPic,
            inventoryStatus,
            rentedBy
        } = req.body;
        const user = req.user.id;
        let book = new Book({
            title,
            description,
            author,
            ISBN,
            genre,
            user,
            coverPic,
            inventoryStatus,
            rentedBy
        });
        //TODO
        //check if the ISBN Number is valid
        //Save the image of the book as buffer in DB
      
        //check if the same ISBN number doesn't exist
        const bookISBN = await Book.findOne({ISBN, user});
        if(bookISBN){
            return res.status(400).send({msg:'ISBN number already exists'});
        }
        
        await book.save();
        res.send(book);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//@route   PUT api/book
//@desc    UPDATE a book to the DB
//@access  PRIVATE
bookRoute.put('/', [auth,
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('id', 'Book ID is required')
    .not()
    .isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        let {
            id,
            title,
            description,
            author,
            genre,
            inventoryStatus,
            rentedBy
        } = req.body;
        const user = req.user.id;
        const bookFields = {
            title,
            description,
            author,
            genre,
            user,
            inventoryStatus,
            rentedBy
        };

        //TODO
        //check if the ISBN Number is valid
        //Save the image of the book as buffer in DB
      
        //Find a book with book id and userid
        let bookWithUser = await Book.findOne({_id:id, user});
        if(!bookWithUser){
            return res.status(400).send({msg:'Book not found for the user'});
        }
        bookWithUser =  await Book.findOneAndUpdate({_id:id, user},{$set:bookFields},{new:true});
        res.json(bookWithUser);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//@route   DELETE api/book
//@desc    DELETE a book to the DB
//@access  PRIVATE
bookRoute.delete('/', [auth,
    check('id', 'Book ID is required')
    .not()
    .isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try{
        let {
            id,
        } = req.body;
        const user = req.user.id;
      
        //Find a book with book id and userid
        let bookWithUser = await Book.findOne({_id:id, user});
        if(!bookWithUser){
            return res.status(400).send({msg:'Book not found for the user'});
        }
        bookWithUser =  await Book.findByIdAndDelete({_id:id, user});
        res.json(bookWithUser);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



module.exports = bookRoute;