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
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Flytta till finally
        }
      };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div>
        <h1>Data List</h1>
        <p>Count: {data.length}</p>

      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default ListPage;
