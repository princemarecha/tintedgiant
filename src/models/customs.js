// models/Customs.js
import {Schema, models, model} from 'mongoose';

const CustomsSchema = new Schema({
    date: { type: String, required: true },
    reference: { type: String, required: true },
    transporter: { type: String, required: true },
    exporter: { type: String, required: true },
    importer: { type: Boolean, required: true },
    trailerPlate: { type: String, required: false },
    cargo: { type: String, required: true },
    status: { type: String, required: true },
    BOE: { type: Number, required: true },
    horse_plate: { type: String, required: true },
    trailer_plate: { type: Number, required: false },
    invoice: { type: Number, required: false },
    invoice_photo: { type: Number, required: false },
    duty: { type: Number, required: false },
}, { timestamps: true });


const Customs = models.Customs || model('Customs', CustomsSchema);
export default Customs

