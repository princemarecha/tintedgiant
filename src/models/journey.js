// models/Journey.js
import {Schema, models, model} from 'mongoose';

const driver = new Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
  });

const truck = new Schema({
name: { type: String, required: true },
plate_id: { type: String, required: true },
});

const JourneySchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    cargo: { type: String, required: false },
    expense: { type: String, required: false },
    delivered: { type: String, required: false },
    distance: { type: Number, required: true },
    status: { type: String, required: true },
    truck: { type: truck, required: true },
    expenses: {
      id: { type: String, required: false },
      totals: [
        {
          currency: { type: String, required: true },
          amount: { type: Number, required: true },
          _id: { type: Schema.Types.ObjectId, required: false },
        },
      ],
    },
    driver: { type: driver, required: true },
    
}, { timestamps: true });


const Journey = models.Journey || model('Journey', JourneySchema);
export default Journey

