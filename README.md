We are building a crypto application that will allow users to track crypto coin portfolio in their accounts and to explore crypto coin market data and price trend. 

Here are the routes provided:

users:
Signup: `POST /login/signup` 
Login: `POST /login` 
Change password: `POST /login/password` (require authentication)
Get users: `GET /login` (require authentication and authorization)
Delete user: `DELETE /login/:id` (require authentication and authorization)

accounts: (require  authentication)
Create: `POST /accounts` 
Get user accounts: `GET /accounts` - user can get own accounts, admin change get all accounts
Get account by id: `GET /accounts/:id` - user can get own account, admin change get any account
Update account: `PUT /accounts/:id` - change account data
Delete account: `delete /accounts/:id` - delete an account (require authorization)

coins:
Get coin data: `GET /coins `- get a list of coins and display information of each coin(id, symbol, price, market cap, rank)
Get coin data by id: `GET /coins/:id/` - get coin data by id 
Create coin: `POST /coins` - add coin data (require authentication and authorization)
Update coin: `PUT /coins/:id` update coin data (require authentication and authorization)
Delete coin: `DELETE /coins/:id` delete coin data (require authentication and authorization)

prices:
Get price data: `GET /prices` - get a list the daily and hourly prices of each coin (id, prices_hourly, prices_daily).
Get price data by id: `GET /prices/:id/ - get price data by id
Get price data by id and days: `GET /prices/trend/:id?days=` - get price data by id for a period of days
Create price: `POST /prices` - add price data (require authentication and authorization)
Update price: `PUT /prices/:id` - update price data (require authentication and authorization)
Delete price: `DELETE /prices/:id` - delete price data (require authentication and authorization)