import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get the current directory name for path resolving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set Pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS) from the 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Sample in-memory database for books
let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: 'Moby Dick', author: 'Herman Melville' }
];

// Routes

// Home Route - Display form to add books
app.get('/', (req, res) => {
  res.render('index', { title: 'Book Library', message: 'Add a New Book' });
});

// POST Route to add a book
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).send('Title and Author are required!');
  }
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.redirect('/books');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

// Route to list all books
app.get('/books', (req, res) => {
  res.render('books', { title: 'Books', books });
});

// Route to delete a book by ID
app.post('/books/:id/delete', (req, res) => {
  const { id } = req.params;
  books = books.filter(book => book.id !== parseInt(id));
  res.redirect('/books');
});

// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.post('/books', (req, res) => {
    console.log(req.body); // Debugging line to inspect form input
    const { title, author } = req.body;
    if (!title || !author) {
      console.error('Missing title or author');
      return res.status(400).send('Title and Author are required!');
    }
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.redirect('/books');
  });
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
