const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'descriptions cannot be more than 500 characters']
    },
    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Incorrect URL, use a valid one with HTTP or HTTPS']
    },
    phone: {
        type: String,
        maxlength: [20, 'phone number cannot more than 20 characters']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'please add a valid email']
    },
    address: {
        type: String,
        required: [true, 'add an address']
    },
    location: {
        //GeoJSON point
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: false,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    carees: {
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'rating must be at least 1'],
        max: [10, 'rating must not be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String, 
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

//Middleware for slug:
BootcampSchema.pre('save', function(next){
    console.log('Slugify is running', this.name)
    this.slug = slugify(this.name, {lower:true});
    next();
});

//Middleware for Geocoder
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location={
        type:'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    //Since geocode gives better info, delete the rest
    this.address = undefined;
    next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);