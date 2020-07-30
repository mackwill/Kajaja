LHL Node Skeleton
=========
## KaJaJa - Listing Website

KaJaJa is a listing web app. You can browse items users are selling and contact the sellers to deal with them. As a seller, you can create listings, updating them and marking them as sold if they get sold. 


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- cors
- dotenv
- lodash
- nodemailer
- pg & pg-native
- express-fileupload

## Getting Started

1. Clone the project.
2. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
3. Install dependencies: `npm i`
5. Reset database: `npm run db:reset`
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Basic Features

- Full registration. Login, Logout, Account creation, Account update.
- Forgot password sequence with Nodemailer. 
- Listing creation, listing update, listing deletion.
- You can add some items to your favourites and remove them.
- Images upload with express-fileupload.
- Search bar acting as a search enigne with the SQL full text search.

## Final Product

!["screenshot of the homepage - mobile"]()
!["screenshot of the listings page - mobile"]()
!["screenshot of the single listing page - mobile"]()
!["screenshot of the account settings page - mobile"]()
!["screenshot of the create settings page - mobile"]()
!["screenshot of the favourties page - mobile"]()
!["screenshot of the message thread - mobile"]()
!["screenshot of the messages - mobile"]()
!["screenshot of the update your listing form - mobile"]()
!["screenshot of the user profile page - mobile"]()
!["screenshot of the single listing page - desktop"]()
!["screenshot of the listings page - tablette"]()


## Authors

- William Mindenhall [Will's Git](https://github.com/mackwill)
- Vincent Bedard-Legault [Vincent's Git](https://github.com/vbedardl)
