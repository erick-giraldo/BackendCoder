import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true},
    purchase_datetime: { type: Date, default: Date.now, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
    products: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
          quantity: { type: Number, require: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Middleware para autogenerar el parámetro 'code' de manera consecutiva
TicketSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    const ticketCount = await mongoose.model("Ticket").countDocuments();
    const code = "TK-" + String(ticketCount + 1).padStart(7, "0");
    this.code = code;
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("Ticket", TicketSchema);
