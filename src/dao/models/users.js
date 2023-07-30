import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    age: { type: Number, require: true },
    password: { type: String, require: true },
    ticket: {
        type: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
        }],
        default: []
    },
    cart: {
        type: [{
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' },
            id: { type: Number }
        }],
        default: []
    },
    role: { type: String, default: 'user', enum: ['user', 'admin', 'premium']},
     documents: { type: Array,  default: [],
    },
    passwordResetTokens: [
        {
          token: String,
          used: Boolean,
          createdAt: Date
        }
      ],
    id: { type: Number},
    last_connection: { type: Date, default: Date.now },
}, { timestamps: true})

UserSchema.pre('save', function (next) {
    if (this.documents.length === 0) {
      this.documents.push({ name: "Pendiente subir documentos" });
    }
    next();
  });
  

export default mongoose.model('User', UserSchema)