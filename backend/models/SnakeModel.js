const mongoose = require('mongoose');

const snakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,  // URL to the image
    required: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  length: {
    type: String,
    required: true,
    trim: true
  },
  headShape: {
    type: String,
    required: true,
    trim: true
  },
  pattern: {
    type: String,
    required: true,
    trim: true
  },
  behavior: {
    type: String,
    required: true,
    trim: true
  },
  venomType: {
    type: String,
    required: true,
    trim: true
  },
  commonSymptoms: [{
    type: String,
    trim: true
  }],
  painLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  painType: {
    type: String,
    required: true,
    trim: true
  },
  timeToSymptoms: {
    type: String,
    required: true,
    trim: true
  },
  nativeProvinces: {
    type: [{
      type: String,
      enum: [
        'Central Province',
        'Eastern Province',
        'North Central Province',
        'Northern Province',
        'North Western Province',
        'Sabaragamuwa Province',
        'Southern Province',
        'Uva Province',
        'Western Province'
      ]
    }],
    required: true,
    validate: [
      {
        validator: function(provinces) {
          return provinces.length > 0;
        },
        message: 'At least one province must be selected'
      }
    ]
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps
});

const Snake = mongoose.model('Snake', snakeSchema);

module.exports = Snake; 