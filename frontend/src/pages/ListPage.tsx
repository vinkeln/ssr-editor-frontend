import { useEffect, useState } from "react";
import axios from "axios";

const ListPage = () =>{
    const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1337/list');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Fel vid hämtning:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
        <h1>Data List</h1>
        <p>Antal: {data.length}</p>

      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default ListPage;
