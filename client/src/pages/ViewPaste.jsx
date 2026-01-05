import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { pasteApi } from '../api/pasteApi';

const ViewPaste = () => {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const response = await pasteApi.getPaste(id);
        setPaste(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load paste');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaste();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="page view-paste">
        <div className="container">
          <div className="loading">Loading paste...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page view-paste">
        <div className="container">
          <div className="error">{error}</div>
          <a href="/" className="back-link">Create a new paste</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page view-paste">
      <div className="container">
        <h1>Paste Content</h1>
        <div className="paste-info">
          {paste.remaining_views !== null && (
            <p>Remaining views: {paste.remaining_views}</p>
          )}
          {paste.expires_at && (
            <p>Expires: {new Date(paste.expires_at).toLocaleString()}</p>
          )}
        </div>
        <div className="paste-content">
          <pre>{paste.content}</pre>
        </div>
        <a href="/" className="back-link">Create a new paste</a>
      </div>
    </div>
  );
};

export default ViewPaste;
