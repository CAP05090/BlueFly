const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    title: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: String, required: true },
    color: { type: String, required: true },
    size:{ type:[Number]},
    productype: { type: String, required: true },
    category: { type: String, required: true },
    description:{ type:[Object], required:true},
    saving:{ type:String, required:true}
}, {
    versionKey: false,
    suppressReservedKeysWarning: true
});

const NewProductModel = mongoose.model("NewProduct", productSchema);

module.exports = {NewProductModel}
