import React, { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import DeletePlacePopup from "./DeletePlacePopup.js";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import Api from "../utils/api.js";
import auth from "../utils/auth.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isDeletePlacePopupOpen, setDeletePlacePopupOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);

  const [cards, setCards] = useState([]);
  const [confirmedCardToDelete, setConfirmedCardToDelete] = useState({});
  const [selectedCard, setSelectedCard] = useState({});

  const [infoToolTipSuccess, setInfoToolTipSuccess] = useState(false);
  const [infoToolTipMessage, setInfoToolTipMessage] = useState("");

  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const history = useHistory();

  const api = new Api({
    baseUrl: "https://react-around-effip-api.herokuapp.com",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  // checking if user already logged in
  useEffect(() => {
    if (token) {
      auth
        .checkToken(token)
        .then((user) => {
          setLoggedIn(true);
          setCurrentUser(user.data);
          history.push("/");
        })
        .catch((err) => {
          if (err === 400) {
            console.log("400 — Token not provided or provided in the wrong format");
          } else if (err === 401) {
            console.log("401 — The provided token is invalid ");
          }
          handleLogout();
        });

      api
        .getInitialCards()
        .then((cards) => {
          setCards(cards.data.reverse());
        })
        .catch((err) => {
          console.log(`There was a problem getting data from the server ${err}`);
        });
    } else {
      history.push("/signin");
    }
  }, [token]);

  // esc listener for popups
  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  };

  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCardDelete = (card) => {
    setDeletePlacePopupOpen(true);
    setConfirmedCardToDelete(card);
  };

  const closeAllPopups = () => {
    setEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setDeletePlacePopupOpen(false);
    setSelectedCard({});
    setIsInfoToolTipOpen(false);
  };

  const handleUserUpdate = (userInfo) => {
    setIsSending(true);
    api
      .saveUserInfo(userInfo.name, userInfo.about)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`There was a problem saving data on the server ${err}`);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleAvatarUpdate = (avatar) => {
    setIsSending(true);
    api
      .setUserAvatar(avatar)
      .then((user) => {
        setCurrentUser(user.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`There was a problem saving the avatar on the server ${err}`);
        setEditAvatarPopupOpen(false);
        setInfoToolTipMessage("Oops, something went wrong! Please try again.");
        setInfoToolTipSuccess(false);
        setIsInfoToolTipOpen(true);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleAddPlaceSubmit = (card) => {
    setIsSending(true);
    api
      .saveCard(card)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);

        closeAllPopups();
      })
      .catch((err) => {
        console.log(`There was a problem adding new place to the server ${err}`);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleCardLike = (card) => {
    // Check one more time if this card was already liked
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Send a request to the API and getting the updated card data
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard.data : c)));
      })
      .catch((err) => {
        console.log(`There was a problem liking this place ${err}`);
      });
  };

  const handleConfirmDeleteCard = () => {
    setIsSending(true);
    api
      .deleteCard(confirmedCardToDelete._id)
      .then(() => {
        setCards(cards.filter((c) => confirmedCardToDelete._id !== c._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`There was a problem deleting this place ${err}`);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleRegister = (email, password) => {
    setIsSending(true);
    auth
      .register(email, password)
      .then((data) => {
        setInfoToolTipMessage("Success! You have now been registered.");
        setInfoToolTipSuccess(true);
        history.push("/signin");
      })
      .catch((err) => {
        if (err === 400) {
          console.log("400 - one of the fields was filled in incorrectly");
        }
        setInfoToolTipMessage("Oops, something went wrong! Please try again.");
        setInfoToolTipSuccess(false);
      })
      .finally(() => {
        setIsSending(false);
        setIsInfoToolTipOpen(true);
      });
  };

  const handleLogin = (email, password) => {
    setIsSending(true);
    auth
      .login(email, password)
      .then((data) => {
        setLoggedIn(true);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        history.push("/");
      })
      .catch((err) => {
        if (err === 400) {
          console.log("400 - one or more of the fields were not provided");
        } else if (err === 401) {
          console.log("401 - the user with the specified email not found ");
        }
        setIsInfoToolTipOpen(true);
        setInfoToolTipSuccess(false);
        setInfoToolTipMessage("Oops, something went wrong! Please try again.");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setToken("");
    localStorage.removeItem("token", "");
    localStorage.removeItem("email", "");
    history.push("/signin");
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header onLogout={handleLogout} />
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          message={infoToolTipMessage}
          success={infoToolTipSuccess}
          onClose={closeAllPopups}
        />
        <Switch>
          <Route path="/signin">{!loggedIn && !token && <Login onLogin={handleLogin} isSending={isSending} />}</Route>
          <Route path="/signup">
            {!loggedIn && !token && <Register onRegister={handleRegister} isSending={isSending} />}
          </Route>

          <ProtectedRoute path="/" loggedIn={loggedIn}>
            <Main
              onEditAvatarClick={handleEditAvatarClick}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <ImagePopup onClose={closeAllPopups} card={selectedCard} />
            <EditProfilePopup
              isSending={isSending}
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUserUpdate={handleUserUpdate}
            />
            <EditAvatarPopup
              isSending={isSending}
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onAvatarUpdate={handleAvatarUpdate}
            />
            <AddPlacePopup
              isSending={isSending}
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlaceSubmit={handleAddPlaceSubmit}
            />
            <DeletePlacePopup
              isSending={isSending}
              isOpen={isDeletePlacePopupOpen}
              onClose={closeAllPopups}
              onDeletePlace={handleConfirmDeleteCard}
            />
            <Footer />
          </ProtectedRoute>
        </Switch>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
