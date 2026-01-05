const Paste = require('../models/Paste');
const { getCurrentTime } = require('../utils/time');

// Health check
const healthCheck = async (req, res) => {
  try {
    // Test database connectivity
    await Paste.findOne().limit(1);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ ok: false, error: 'Database connection failed' });
  }
};

// Create paste
const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    // Validate content
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required and cannot be empty' });
    }

    const currentTime = getCurrentTime(req);
    const pasteData = {
      content: content.trim(),
      views: 0
    };

    // Handle TTL
    if (ttl_seconds && typeof ttl_seconds === 'number' && ttl_seconds >= 1) {
      pasteData.expiresAt = new Date(currentTime.getTime() + (ttl_seconds * 1000));
    }

    // Handle max views
    if (max_views && typeof max_views === 'number' && max_views >= 1) {
      pasteData.maxViews = Math.floor(max_views);
    }

    const paste = new Paste(pasteData);
    await paste.save();

    // Generate URL (assuming frontend domain, adjust as needed)
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = `${baseUrl}/p/${paste._id}`;

    res.status(201).json({
      id: paste._id,
      url: url
    });
  } catch (error) {
    console.error('Create paste error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get paste by ID (API)
const getPaste = async (req, res) => {
  try {
    const { id } = req.params;
    const currentTime = getCurrentTime(req);

    const paste = await Paste.findById(id);
    if (!paste) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    // Check if expired
    if (paste.expiresAt && paste.expiresAt <= currentTime) {
      return res.status(404).json({ error: 'Paste has expired' });
    }

    // Check if max views exceeded
    if (paste.maxViews && paste.views >= paste.maxViews) {
      return res.status(404).json({ error: 'Paste view limit exceeded' });
    }

    // Increment views atomically
    await Paste.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Calculate remaining views
    let remainingViews = null;
    if (paste.maxViews) {
      remainingViews = paste.maxViews - (paste.views + 1);
    }

    res.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null
    });
  } catch (error) {
    console.error('Get paste error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// View paste (HTML page)
const viewPaste = async (req, res) => {
  try {
    const { id } = req.params;
    const currentTime = getCurrentTime(req);

    const paste = await Paste.findById(id);
    if (!paste) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Paste Not Found</title></head>
        <body><h1>Paste Not Found</h1><p>The paste you're looking for doesn't exist.</p></body>
        </html>
      `);
    }

    // Check if expired
    if (paste.expiresAt && paste.expiresAt <= currentTime) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Paste Expired</title></head>
        <body><h1>Paste Expired</h1><p>This paste has expired.</p></body>
        </html>
      `);
    }

    // Check if max views exceeded
    if (paste.maxViews && paste.views >= paste.maxViews) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>View Limit Exceeded</title></head>
        <body><h1>View Limit Exceeded</h1><p>This paste has reached its maximum view limit.</p></body>
        </html>
      `);
    }

    // Increment views atomically
    await Paste.findByIdAndUpdate(id, { $inc: { views: 1 } });

    // Escape HTML content for security
    const escapedContent = paste.content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pastebin Lite</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
          .content { white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pastebin Lite</h1>
          </div>
          <div class="content">${escapedContent}</div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('View paste error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body><h1>Internal Server Error</h1></body>
      </html>
    `);
  }
};

module.exports = {
  healthCheck,
  createPaste,
  getPaste,
  viewPaste
};
