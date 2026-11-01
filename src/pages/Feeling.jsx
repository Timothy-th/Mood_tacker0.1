import ChooseMood from "../components/feeling/ChooseMood";
import Footer from "../components/Footer";
import "../styles/feeling.css";

const Feeling = () => {
  const handleMoodSubmit = (moodEntry) => {
    console.log("Selected mood:", moodEntry);

    // You can update your page or calendar here.
  };

  return (
    <main className="min-h-screen bg-rose-50/40 px-4 pb-12 pt-28">
      <div className="mx-auto max-w-6xl">
        <ChooseMood onSubmitMood={handleMoodSubmit} />
      </div>
      <Footer />
    </main>
  );
};

export default Feeling;
