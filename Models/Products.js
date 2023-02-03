const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    p_name : {
        type : String,
        required : true,
        unique : true
    } ,
    p_price : {
        type : Number,
        required : true,
        default : 0
    },
    p_cat : {
      type :String,
      required : true
    },
    p_desc : {
      type  :  String,
      required : true
    },
    p_image : {
      type : String,
      required : true
    },
    avl_quantity : {
      type : Number,
      required : true,
      default  : 0
    }
})

const Product = mongoose.model("Products" , ProductSchema);

module.exports = Product;