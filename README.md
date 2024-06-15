
Provide clear instructions on how to set up and run the app locally
1. git clone <repository_url>
2. cd <repository_directory>
3. cd backend
4. npm install
5. Set environment variables:

Configure environment variables in .env backend directories.

SHOPIFY_API_KEY=9b38b9e676929dae68e575ace7726651
SHOPIFY_API_SECRET=8e7bda2eb31842bcf5af76f8da0e9d72
SHOPIFY_SCOPES=write_products,read_products
SHOPIFY_SHOP=@quickstart-4bd40057.myshopify.com
SHOPIFY_TOKEN=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

//this is the end url
https://9b38b9e676929dae68e575ace7726651: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@quickstart-4bd40057.myshopify.com/admin/api/2021-04/products.json


5. for run - nodemon / node server.js


6. Document the API endpoints and how to use them.
Base URL
The base URL for all API endpoints is http://localhost:5000/api.

Endpoints
1. GET /products
Description: Fetches all products.
Method: GET
URL: /products
Headers:
x-shopify-access-token: Access token for authentication
Response:
Status: 200 OK
Body: Array of order objects

2. POST /products
Description: Creates a new order.
Method: POST
URL: /products
Headers:
x-shopify-access-token: Access token for authentication
Content-Type: application/json
Body:
JSON object containing order details
Response:
Status: 201 Created
Body: JSON object of the created order

3. UPDATE and DELETE /products/
Description: Deletes , Updates an order by ID.
Method: DELETE and PUT
URL: /products/:id
Headers:
x-shopify-access-token: Access token for authentication
URL Parameters:
id: ID of the order to delete
Response:
Status: 204 No Content

Similar for the orders


LINKS-
Live link: https://shopfiy.netlify.app/
backend live Link:  https://shopify-backend-three.vercel.app/
Git Frontend- https://github.com/Abhishekkuntare/shopify_frontend
Git Backend- https://github.com/Abhishekkuntare/shopify_backend