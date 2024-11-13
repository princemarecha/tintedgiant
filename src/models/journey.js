// models/Journey.js
import {Schema, models, model} from 'mongoose';

const JourneySchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    cargo: { type: Boolean, required: true },
    expense: { type: String, required: false },
    delivered: { type: String, required: true },
    journey_id: { type: String, required: true },
    distance: { type: Number, required: true },
    status: { type: String, required: true },
    truck: { type: Number, required: false },
    driver: { type: Number, required: false },
    
}, { timestamps: true });


const Journey = models.Journey || model('Journey', JourneySchema);
export default Journey

