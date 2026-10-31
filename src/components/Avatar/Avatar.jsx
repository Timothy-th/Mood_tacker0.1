import { useState } from "react";
import Male from "./Male";
import Female from "./Female";
import "../../styles/avatar.css";
// import "../ava.css";

const Profile = () => {
  const [gender, setGender] = useState(null);

  return (
    <>
      <section id="start" className="start text-center my-4 reveal-me">
        <h1>Welcome to your Avatar Studio!</h1>

        <p>
          Here, you can create a custom avatar that reflects your mood and
          personality.
          <br />
          Choose a mood, customize the look, and watch your unique character
          come to life.
        </p>

        <h2>So shall we start?</h2>
      </section>

      <div className="hr reveal-me" />
      <div className="hr reveal-me" />

      <section id="gender" className="reveal-me text-center">
        <h3>Choose your Gender</h3>

        <button
          type="button"
          className="mt-3 rounded-lg bg-pink-400 px-6 py-2 text-white hover:bg-pink-500"
          onClick={() => setGender("male")}
        >
          Male
        </button>

        <button
          type="button"
          className="ml-4 mt-3 rounded-lg bg-pink-400 px-6 py-2 text-white hover:bg-pink-500"
          onClick={() => setGender("female")}
        >
          Female
        </button>
      </section>

      {gender === "male" && <Male />}
      {gender === "female" && <Female />}
    </>
  );
};

export default Profile;
