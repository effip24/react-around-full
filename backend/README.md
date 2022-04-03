# react-around-api-full

The API of "Around the U.S." with authorization and registration handled by the back-end server.
This repository contains the full API of "Around the U.S." project that features user authorization and user registration and handles cards and users.

## Backend

#### Technologies and Techniques

<p align="left"> 
 <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="express js" width="40" height="40"/>

<img src="https://cdn.icon-icons.com/icons2/2415/PNG/512/mongodb_plain_wordmark_logo_icon_146423.png" alt="mongoDB" width="40" height="40"/>
</p>

#### Link to the API: https://react-around-effip-api.herokuapp.com/

| end point                     | Description                |
| :---------------------------- | :------------------------- |
| `POST /signin`                | authorization              |
| `POST /signup`                | registration               |
| `GET /users`                  | returns all users          |
| `GET /user`                   | returns specific user      |
| `GET /users/me`               | returns a logged in user   |
| `PATCH /users/me`             | updates user info          |
| `PATCH /users/me/avatar`      | updates user's avatar      |
| `GET /cards`                  | returns all cards          |
| `POST /cards`                 | creates new card           |
| `DELETE /cards/:cardId`       | deletes specific card      |
| `DELETE /cards/:cardId/likes` | removes a like from a card |
| `PUT /cards/:cardId/likes`    | add a like to a card       |

#### run the server:

```
  git clone https://github.com/effip24/react-around-api.git
```

```
  cd react-around-api
```

```
  npm install
```

```
  npm run start
```
