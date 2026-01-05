const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0;
      },
      message: 'Content cannot be empty'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  maxViews: {
    type: Number,
    default: null,
    min: [1, 'Max views must be at least 1']
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  }
});

// Index for efficient queries
pasteSchema.index({ expiresAt: 1 });
pasteSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Paste', pasteSchema);
