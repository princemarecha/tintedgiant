import { Schema, models, model } from 'mongoose';

const attachments = new Schema({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
});

const CustomsSchema = new Schema(
  {
    date: { type: String, required: true },
    reference: { type: String, required: true },
    transporter: { type: String, required: true },
    exporter: { type: String, required: true },
    importer: { type: String, required: true },
    status: { type: String, required: false },
    trailerPlate: { type: String, required: false },
    cargo: { type: String, required: true, default: false },
    BOE: { type: String, required: true },
    horse_plate: { type: String, required: true },
    trailer_plate: { type: String, required: false },
    invoice: { type: String, required: false },
    attachments: { type: [attachments], required: false },  // Changed to an array of strings
    duty_currency:{ type: String, required: true },
    duty: { type: Number, required: false },
    cleared: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const Customs = models.Customs || model('Customs', CustomsSchema);
export default Customs;
