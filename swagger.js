/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         profileImg:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         isDeleted:
 *           type: boolean
 *         deletedBy:
 *           type: object
 *         deletedAt:
 *           type: string
 *           format: date-time
 *     SignUpInput:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
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
 *       400:
 *         description: Invalid user id
 *       404:
 *         description: User not found or already deleted
 *       500:
 *         description: Server error
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - caption
 *         - rating
 *         - imageUrl
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         caption:
 *           type: string
 *         rating:
 *           type: number
 *         imageUrl:
 *           type: string
 *         author:
 *           type: object
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ImageUploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         imageUrl:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         profileImg:
 *           type: string

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
 *             type: object
 *             required:
 *               - title
 *               - caption
 *               - rating
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *               caption:
 *                 type: string
 *               rating:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       409:
 *         description: Book already exists
 *       422:
 *         description: All fields are required

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
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 count:
 *                   type: integer

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
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 count:
 *                   type: integer

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
 *       400:
 *         description: Invalid book ID
 *       404:
 *         description: Book not found
 */
