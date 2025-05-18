// models/Employee.js
import {Schema, models, model} from 'mongoose';

const EmployeeSchema = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, required: true },
    nationality: { type: String, required: true },
    nationalID: { type: String, required: true },
    passportNumber: { type: String, required: true },
    occupation: { type: String, required: true },
    kmtravelled: { type: Number, required: false },
    avg_km: { type: Number, required: false },
    journeys: { type: Number, required: false },
    opCosts: { type: Number, required: false },
    avg_op_costs: { type: Number, required: false },
    photo: { type: String, required: false },
}, { timestamps: true });


const Employee = models.Employee || model('Employee', EmployeeSchema);
export default Employee

