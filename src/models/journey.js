// models/Journey.js
import {Schema, models, model} from 'mongoose';

const JourneySchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    cargo: { type: String, required: false },
    expense: { type: String, required: false },
    delivered: { type: String, required: false },
    journey_id: { type: String, required: false },
    distance: { type: Number, required: true },
    status: { type: String, required: true },
    truck: { type: Number, required: true },
    driver: { type: Number, required: true },
    
}, { timestamps: true });


const Journey = models.Journey || model('Journey', JourneySchema);
export default Journey

