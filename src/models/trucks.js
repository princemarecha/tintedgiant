// models/Truck.js
import {Schema, models, model} from 'mongoose';

const TruckSchema = new Schema({
    name: { type: String, required: true },
    status: { type: String, required: false, default:"Active" },
    location: { type: String, required: true },
    make: { type: String, required: true },
    travelling: { type: String, required: false },
    trailer: { type: Boolean, required: true },
    trailerPlate: { type: String, required: false },
    colour: { type: String, required: true },
    plate_id: { type: String, required: true },
    mileage: { type: Number, required: true },
    fuel: { type: String, required: true },
    journeys: { type: Number, required: false },
    avg_km: { type: Number, required: false },
    opCosts: { type: Number, required: false },
    avg_opCosts: { type: Number, required: false },
    photos: { type: [String], required: false },
}, { timestamps: true });


const Truck = models.Truck || model('Truck', TruckSchema);
export default Truck

