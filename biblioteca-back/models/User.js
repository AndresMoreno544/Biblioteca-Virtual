import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    contrasena: {
      type: String,
      required: true,
      minlength: 6
    },
    rol: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('contrasena')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.contrasena = await bcryptjs.hash(this.contrasena, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararContrasena = async function(contrasenaIngresada) {
  return await bcryptjs.compare(contrasenaIngresada, this.contrasena);
};

// No incluir contraseña en JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.contrasena;
  return obj;
};

export default mongoose.model('User', userSchema);
