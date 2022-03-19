import React, { useState } from "react";
import "../css/trail_form.css";
import {
  IonInput,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonItem,
  IonLabel,
  IonRange,
  IonTextarea,
} from "@ionic/react";

function TrailForm({ setTrails, setTrail, trails, trail }) {
  
  const [trailName, setTrailName] = useState(trail?trail.trail_name:"");
  const [features, setFeatures] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [roundtrip, setRoundTrip] = useState();
  const [elevation, setElevation] = useState();
  const [difficulty, setDifficulty] = useState();
  const [popular, setPopular] = useState(false);
  const [description, setDescription] = useState("");

  console.log(trail);


  function handleSubmit(event) {
    event.preventDefault();

    if (trail) {
      fetch(`/trails/${trail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trail_name: trailName,
          features: features,
          image_url: imageUrl,
          roundtrip: roundtrip,
          elevation_gain: elevation,
          difficulty: difficulty,
          popular: popular,
          description: description,
        }),
      }).then(res=> {
        if (res.ok) {
          res.json().then(updatedTrail => {
            setTrail(updatedTrail)
            
          })
        
          
          
        }
      })
    } else {
      fetch("/trails", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trail_name: trailName,
          features: features,
          image_url: imageUrl,
          roundtrip: roundtrip,
          elevation_gain: elevation,
          difficulty: difficulty,
          popular: popular,
          description: description,
        }),
      }).then((res) => {
        if (res.ok) {
          res.json().then((trail) => setTrails([...trails, trail]));
        }
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="trail-form">
      <IonCardHeader>
        <IonCardTitle>{trail?"Update Trail":"Create A Trail"}</IonCardTitle>
      </IonCardHeader>

      <IonItem>
        <IonLabel position="stacked">Multiple Inputs</IonLabel>
        <IonInput
          onIonChange={(e) => setTrailName(e.target.value)}
          placeholder="Trail Name"
          value={trailName}
        ></IonInput>
        <IonInput
          onIonChange={(e) => setFeatures(e.target.value)}
          placeholder="Features"
          value={features}
        ></IonInput>
        <IonInput
          onIonChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image Url"
          value={imageUrl}
        ></IonInput>

        <IonInput
          onIonChange={(e) => setRoundTrip(e.target.value)}
          placeholder="Roundtrip"
          value={roundtrip}
        ></IonInput>
        <IonInput
          onIonChange={(e) => setElevation(e.target.value)}
          placeholder="Elevation Gain"
          value={elevation}
        ></IonInput>
        <IonInput
          onIonChange={(e) => setPopular(e.target.value)}
          placeholder="Popular"
          value={popular}
        ></IonInput>
      </IonItem>
      <ion-item>
        <ion-label>Difficulty:</ion-label>
        <IonRange
          onIonChange={(e) => setDifficulty(e.target.value)}
          min="0"
          max="10"
          step="1"
          value={difficulty}
          snaps
          color="danger"
          pin
        ></IonRange>
      </ion-item>

      <IonItem>
        <IonTextarea
          onIonChange={(e) => setDescription(e.target.value)}
          value={description}
          className="description-box"
          placeholder="Description:"
        ></IonTextarea>
      </IonItem>

      <IonButton type="submit" color="success" className="">
        Save
      </IonButton>
    </form>
  );
}

export default TrailForm;
