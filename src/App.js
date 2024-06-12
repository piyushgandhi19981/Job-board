import { useEffect, useState } from "react";
import "./styles.css";

const ITEMS_PER_PAGE = 6;

const API_ENDPOINT = "https://hacker-news.firebaseio.com/v0";

function JobPosting({ title, url, by, time, id }) {
  const formattedDate = new Date(time * 1000).toLocaleDateString();

  return (
    <div className="post" key={id}>
      <h2 className="post__title">
        <a className={url ? "" : "inactiveLink"} target="_blank" href={url}>
          {title}
        </a>
      </h2>
      <span className="post__metadata">
        By {by} {formattedDate}
      </span>
    </div>
  );
}

export default function App() {
  const [ids, setIds] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchItems = async (currPage, fetchedIds) => {
    let fetchIds = ids || fetchedIds;
    setFetching(true);
    setCurrentPage(currPage);
    const fetchingIds = fetchIds.slice(
      currPage * ITEMS_PER_PAGE,
      (currPage + 1) * ITEMS_PER_PAGE
    );
    const idsData = await Promise.all(
      fetchingIds.map((fetchingId) =>
        fetch(
          `https://hacker-news.firebaseio.com/v0/item/${fetchingId}.json`
        ).then((res) => res.json())
      )
    );
    setItems([...items, ...idsData]);
    setFetching(false);
  };

  useEffect(() => {
    (async () => {
      const fetchIdsResponse = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      const idsData = await fetchIdsResponse.json();
      setIds(idsData);
      setLoading(false);
      fetchItems(0, idsData);
    })();
  }, []);

  return (
    <div className="app">
      <h2 className="title">Hacker New Job Board</h2>
      {loading ? (
        <div className="loading">loading...</div>
      ) : (
        <div className="items">
          {items.map((item) => (
            <JobPosting {...item} />
          ))}
        </div>
      )}
      <div className="load-container">
        {items.length >= ids?.length ? null : (
          <button
            disabled={loading || fetching}
            onClick={() => fetchItems(currentPage + 1)}
            className="loadButton"
          >
            {fetching ? "Fetching" : "Load More Jobs"}
          </button>
        )}
      </div>
    </div>
  );
}
