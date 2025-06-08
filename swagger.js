/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64c31e8e3e45d1fbb59e38c3"
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         profileImg:
 *           type: string
 *           example: "https://example.com/avatar.png"
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: "user"
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         deletedBy:
 *           type: object
 *           example: null
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           example: null
 * 
 *     SignUpInput:
 *       type: object
 *       required: [email, username, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "newuser@example.com"
 *         username:
 *           type: string
 *           example: "new_user"
 *         password:
 *           type: string
 *           example: "password123"
 * 
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         password:
 *           type: string
 *           example: "securePassword!"
 * 
 *     Book:
 *       type: object
 *       required: [title, caption, rating, imageUrl]
 *       properties:
 *         _id:
 *           type: string
 *           example: "64d4e8b2e9fbe2bcf874e142"
 *         title:
 *           type: string
 *           example: "The Great Gatsby"
 *         caption:
 *           type: string
 *           example: "A novel by F. Scott Fitzgerald"
 *         rating:
 *           type: number
 *           example: 4.7
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/gatsby.jpg"
 *         author:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-01T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-06-05T15:00:00.000Z"
 * 
 *     ImageUploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Image uploaded successfully"
 *         imageUrl:
 *           type: string
 *           example: "https://example.com/uploads/book.jpg"
 *
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered"
 *               userId: "64c31e8e3e45d1fbb59e38c3"
 *       409:
 *         description: Email or username already exists
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 *
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               accessToken: "jwt.token.here"
 *               refreshToken: "refresh.token.here"
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       422:
 *         description: Missing fields
 *       500:
 *         description: Server error
 *
 * /auth:
 *   get:
 *     summary: Get all non-deleted users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               users:
 *                 - id: "64c31e8e3e45d1fbb59e38c3"
 *                   username: "john_doe"
 *                   email: "john@example.com"
 *       500:
 *         description: Server error
 *
 * /auth/{id}:
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User soft-deleted"
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found or already deleted
 *       500:
 *         description: Server error
 *
 * /books/upload:
 *   post:
 *     summary: Upload an image for a book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       422:
 *         description: Image is required
 *
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: "64d4e8b2e9fbe2bcf874e142"
 *               title: "The Great Gatsby"
 *               caption: "A classic novel"
 *               rating: 4.7
 *               imageUrl: "https://example.com/gatsby.jpg"
 *       409:
 *         description: Book already exists
 *       422:
 *         description: All fields are required
 * 
 *   get:
 *     summary: Get all books (paginated)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Books fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               books:
 *                 - _id: "64d4e8b2e9fbe2bcf874e142"
 *                   title: "The Great Gatsby"
 *                   caption: "A classic novel"
 *                   rating: 4.7
 *                   imageUrl: "https://example.com/gatsby.jpg"
 *               count: 1
 *
 * /books/user:
 *   get:
 *     summary: Get books created by the authenticated user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Books fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               books:
 *                 - _id: "64d4e8b2e9fbe2bcf874e142"
 *                   title: "The Great Gatsby"
 *                   caption: "A classic novel"
 *                   rating: 4.7
 *                   imageUrl: "https://example.com/gatsby.jpg"
 *               count: 1
 *
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Book deleted"
 *       400:
 *         description: Invalid book ID
 *       404:
 *         description: Book not found
 */
