import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    url: {type:String, require:true},
    code:  {type:Number, require:true, unique: true, default: 0},
    title:  {type:String, require:true},
    rating:  {type:String, require:true},
    rate:  {type:Number, require:true, default: 0},
    currency:  {type:String, require:true},
    perks:  {type:String,'value':["String"], require:true},
},{
    timestamps: true
});

const address = new mongoose.Schema({

    content: {type:String, require:true},
    number: {type:String, require:true},
    street: {type:String, require:true},
})

const city = new mongoose.Schema({
    content: {type:String, require:true},
})

const coordinates = new mongoose.Schema({
    latitude: {type:Number, require:true},
    longitude: {type:Number, require:true},
})

const description = new mongoose.Schema({
    content: {type:String, require:true},
})

const facilities = new mongoose.Schema({
    facilityCode: {type:Number, require:true},
    facilityGroupCode: {type:Number, require:true},
    indYesOrNo: {type:Boolean, require:true},
    number: {type:Number, require:true},
    order:  {type:Number, require:true},
    voucher: {type:Boolean, require:true},
})

const images = new mongoose.Schema({
    imageTypeCode: {type:String, require:true}, 
    order:  {type:Number, require:true},
    path: {type:String, require:true},
    visualOrder: {type:Number, require:true},
})

const interestPoints = new mongoose.Schema({
    distance: {type:String, require:true}, 
    facilityCode:  {type:Number, require:true},
    facilityGroupCode: {type:Number, require:true},
    order: {type:Number, require:true},
    poiName: {type:String, require:true}, 
})

const issues = new mongoose.Schema({
    alternative: {type:Boolean, require:true}, 
    dateFrom:  {type:String, require:true},
    dateTo: {type:String, require:true},
    issueCode: {type:String, require:true}, 
    issueType: {type:String, require:true}, 
    order: {type:Number, require:true}, 
})

const name = new mongoose.Schema({
    content:  {type:String, require:true},
})

const phones = new mongoose.Schema({
    phoneNumber:  {type:String, require:true},
    phoneType:  {type:String, require:true},
})

const rooms = new mongoose.Schema({
    characteristicCode:  {type:String, require:true},
    isParentRoom:  {type:Boolean, require:true},
    maxAdults:{type:Number, require:true},
    maxChildren:{type:Number, require:true},
    maxPax:{type:Number, require:true},
    maxPax:{type:Number, require:true},
    minAdults: {type:Number, require:true},
    minPax: {type:Number, require:true},
    roomCode: {type:String, require:true},
    roomType: {type:String, require:true},
})

const terminals = new mongoose.Schema({
    distance:{type:Number, require:true},
    terminalCode: {type:String, require:true},
})

const hotelRoomDescription = new mongoose.Schema({
    content:{type:String, require:true},
})


const wildcards = new mongoose.Schema({
    characteristicCode:{type:String, require:true},
    hotelRoomDescription: [hotelRoomDescription],
    roomCode:{type:String, require:true},
    roomType:{type:String, require:true},
})

const singleHotelSchema = new mongoose.Schema({

    S2C: {type:String, require:true},
    accommodationTypeCode: {type:String, require:true},
    address: [address],
    boardCodes: {type:Array,'value':["String"],require:true},
    categoryCode: {type:String, require:true},
    categoryGroupCode: {type:String, require:true},
    chainCode: {type:String, require:true},
    city: [city],
    code:  {type:Number, require:true,unique:true, default: 0},
    coordinates: [coordinates],
    countryCode: {type:String, require:true},
    description: [description],
    destinationCode: {type:String, require:true},
    email: {type:String, require:true},
    facilities: [facilities],
    images: [images],
    interestPoints: [interestPoints],
    issues: [issues],
    lastUpdate: {type:String, require:true},
    license: {type:String, require:true},
    name: [name],
    phones: [phones],
    postalCode: {type:String, require:true},
    ranking: {type:Number, require:true, default: 0},
    rooms: [rooms],
    segmentCodes: {type:Array,'value':["Number"],require:true},
    stateCode: {type:String, require:true},
    terminals: [terminals], 
    web: {type:String, require:true},
    wildcards:  [wildcards], 
    zoneCode: {type:Number, require:true, default: 0},


})




const Hotel = mongoose.models.realHotel || mongoose.model('realHotel', singleHotelSchema);
export default Hotel;
