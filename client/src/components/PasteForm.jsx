import { useState } from 'react';
import { pasteApi } from '../api/pasteApi';

const PasteForm = () => {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = {
        content,
        ...(ttlSeconds && { ttl_seconds: parseInt(ttlSeconds) }),
        ...(maxViews && { max_views: parseInt(maxViews) }),
      };

      const response = await pasteApi.createPaste(data);
      setSuccess(`Paste created! Share this link: ${response.data.url}`);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create paste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paste-form">
      <h2>Create New Paste</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your paste content here..."
            rows={10}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ttl">TTL (seconds, optional):</label>
            <input
              type="number"
              id="ttl"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              placeholder="e.g., 3600"
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxViews">Max Views (optional):</label>
            <input
              type="number"
              id="maxViews"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="e.g., 10"
              min="1"
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default PasteForm;
