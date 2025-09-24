import { useEffect, useState } from "react";

interface Film {
  _id?: string;
  title?: string;
  [key: string]: unknown; // fallback if your films have other fields
}

function FilmsList() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const response = await fetch("/api/films");
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched films:", data);
        setFilms(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, []);

  if (loading) return <p>Loading films...</p>;
  if (error) return <p>Error fetching films: {error}</p>;

  return (
    <div>
      <h2>Films from API</h2>
      {films.length === 0 ? (
        <p>No films found.</p>
      ) : (
        <ul>
          {films.map((film, index) => (
            <li key={film._id || index}>
              {film.title ?? "Untitled film"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilmsList;
