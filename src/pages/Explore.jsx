import "./Explore.scss";
export default function Explore() {
  return (
    <section className="movie-det_header">
      <button onClick={() => navigate(-1)}>
        <img src={BackIcon} alt="Back" />
      </button>
      <h2>Details Movie</h2>
      <button>
        <img src={Bookmark} alt="Back" />
      </button>
    </section>
  );
}
