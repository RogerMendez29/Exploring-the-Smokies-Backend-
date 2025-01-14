import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "../css/trail_card.css";
import { IonButton } from "@ionic/react";

function Trail_card({
  allSetTrails,
  allTrails,
  trail,
  currentUser,
  savedTrails,
  setSavedTrails,
  savedTrailIds,
  completedTrailIds,
  setCompletedTrails,
  completedTrails,
}) {

  const [isSaved, setisSaved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  let history = useHistory();

  function navToPage() {
    history.push(`/trail_page/${trail.id}`);
  }

  useEffect(() => {
    if (savedTrailIds?.includes(trail.id)) {
      setisSaved(true);
    }
    if (completedTrailIds?.includes(trail.id)) {
      setIsCompleted(true);
    }
  }, []);

  

  let savedTrailObject = savedTrails?.filter(
    (savedTrail) => savedTrail.trail_id === trail.id
  );
  let completedTrailObject = completedTrails?.filter(
    (completedTrail) => completedTrail.trail_id === trail.id
  );

  function handleBookmark() {
    if (savedTrailIds.includes(trail.id)) {
      fetch(`/api/saved_trails/${savedTrailObject[0]?.id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            setisSaved(false);
          }
        })
        .then(() => {
          fetch("/api/me")
            .then((res) => res.json())
            .then((user) => {
              setSavedTrails(user.saved_trails);
            });
        });
    } else {
      fetch("/api/saved_trails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({
          user_id: currentUser.id,
          trail_id: trail.id,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setisSaved(true);
          }
        })
        .then(() => {
          fetch("/api/me")
            .then((res) => res.json())
            .then((user) => {
              setSavedTrails(user.saved_trails);
            });
        });
    }
  }

  function handleComplete() {
    if (completedTrailIds.includes(trail.id)) {
      fetch(`/api/completed_trails/${completedTrailObject[0].id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            setIsCompleted(false);
          }
        })
        .then(() => {
          fetch("/api/me")
            .then((res) => res.json())
            .then((user) => {
              setCompletedTrails(user.completed_trails);
            });
        });
    } else {
      fetch("/api/completed_trails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          trail_id: trail.id,
        }),
      })
        .then((res) => {
          if (res.ok) {
            setIsCompleted(true);
          }
        })
        .then(() => {
          fetch("/api/me")
            .then((res) => res.json())
            .then((user) => {
              setCompletedTrails(user.completed_trails);
            });
        });
    }
  }

  function handleDelete() {
    fetch(`/api/trails/${trail.id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        const updatedTrails = allTrails.filter((oldTrail) => {
          return oldTrail.id !== trail.id;
        });
        allSetTrails(updatedTrails);
      }
    });
  }

  return (
    <div className="container-card">
      <ion-card className="trail-card">
        {currentUser.user_can_modify && savedTrailIds ? (
          <IonButton
            onclick={handleDelete}
            color="danger"
            className="delete-btn "
          >
            Delete
          </IonButton>
        ) : null}

        <img className="trail-image" src={trail.image_url} />

        <svg
          onClick={handleComplete}
          xmlns="http://www.w3.org/2000/svg"
          className={`ionicon ${isCompleted ? "completedCheck" : "check"}`}
          viewBox="0 0 512 512"
        >
          <title>Completed Checkmark</title>
          <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm108.25 138.29l-134.4 160a16 16 0 01-12 5.71h-.27a16 16 0 01-11.89-5.3l-57.6-64a16 16 0 1123.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0124.5 20.58z" />
        </svg>
        {savedTrailIds ? (
          <svg
            id="bookmark"
            onClick={handleBookmark}
            xmlns="http://www.w3.org/2000/svg"
            className={`ionicon ${isSaved ? "saved-bookmark" : "bookmark"}`}
            viewBox="0 0 512 512"
          >
            <title>Bookmark</title>
            <path
              d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32"
            />
          </svg>
        ) : null}

        <div className="header-container">
          <ion-card-header>
            <div onClick={navToPage} className="">
              <div className="card-title">
                <ion-card-title color="none">{trail.trail_name}</ion-card-title>
              </div>
            </div>

            <ion-card-subtitle>
              Difficulty: {trail.difficulty} • Roundtrip: {trail.roundtrip}{" "}
              Miles
            </ion-card-subtitle>
          </ion-card-header>
        </div>
      </ion-card>
    </div>
  );
}

export default Trail_card;
