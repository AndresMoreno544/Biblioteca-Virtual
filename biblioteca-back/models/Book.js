import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    autor: {
      type: String,
      required: true,
      trim: true
    },
    portada: {
      type: String,
      required: true
    },
    sinopsis: {
      type: String,
      required: true
    },
    disponibles: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    pretados: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      default: function() {
        return this.disponibles + this.pretados;
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Calcular total automáticamente
bookSchema.pre('save', function(next) {
  this.total = this.disponibles + this.pretados;
  next();
});

export default mongoose.model('Book', bookSchema);
