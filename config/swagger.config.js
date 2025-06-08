import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Store API",
      version: "1.0.0",
      description: "API documentation for Book Store",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
        description: "Development server",
      },
      {
        url: "https://book-store-h6sd.onrender.com/api",
        description: "Production server",
      },
    ],
  },
  apis: ["swagger.js"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
