import { Schema, models, model } from 'mongoose';

const CustomsSchema = new Schema(
  {
    date: { type: String, required: true },
    reference: { type: String, required: true },
    transporter: { type: String, required: true },
    exporter: { type: String, required: true },
    importer: { type: String, required: true },
    trailerPlate: { type: String, required: false },
    cargo: { type: String, required: true, default: false },
    BOE: { type: Number, required: true },
    horse_plate: { type: String, required: true },
    trailer_plate: { type: String, required: false },
    invoice: { type: Number, required: false },
    attachments: { type: [String], required: false },  // Changed to an array of strings
    duty: { type: Number, required: false },
    cleared: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const Customs = models.Customs || model('Customs', CustomsSchema);
export default Customs;
