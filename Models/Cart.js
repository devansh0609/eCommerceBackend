const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user_id :{
        type : String,
        require : true
    },
    product_id : {
        type : String,
        require : true
    },
    p_name : {
        type : String,
        required : true
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
    quantity : {
      type : Number,
      default : 1
    }

})

const Cart = mongoose.model("Cart" , CartSchema);

module.exports = Cart;