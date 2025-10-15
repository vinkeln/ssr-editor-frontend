import { useQuery } from "@apollo/client/react";
import { GET_FILMS } from "../graphQL/queries";

interface Film {
  id: string;
  title: string;
  director: string;
  year: string;
  genre: string;
}

interface GetFilmsData {
  films: Film[];
}

function FilmsList() {
  const { loading, error, data } = useQuery<GetFilmsData>(GET_FILMS);

  if (loading) return <p>Loading films...</p>;
  if (error) return <p>Error fetching films: {error.message}</p>;

  const films = data?.films || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Films (GraphQL)</h2>
      {films.length === 0 ? (
        <p>No films found.</p>
      ) : (
        <ul className="space-y-2">
          {films.map((film) => (
            <li key={film.id} className="border-b py-2">
              🎬 <strong>{film.title}</strong> ({film.year}) — {film.director}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilmsList;
