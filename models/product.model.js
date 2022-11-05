const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, unique: true},
        price: {type: Number, required: true},
        desc: {type: String, required: true},
        category: {type: String},
        sizes: {type: Array},
        color: {type: String},
        stock: {type: Number, required: true},
        img: {type: String, required: true},
        img_product: []

    },
    {timestamps: true}
);
// module.exports = mongoose.model("Product", ProductSchema);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;