const userModel = require('../Models/Users');
const productModel = require('../Models/Products');
const cartModel = require('../Models/Cart');

const bcrypt = require('bcrypt');

exports.getRegData = (req,res) =>{
    
    // console.log(req.body);
    // const users = new userModel(req.body);
    // users.save().then((result)=>{
    //     res.status(200).send("User Registered Succussfully");
    // }).catch((err)=>{
    //     res.status(400).send("Registration Unsuccessful");
    // })
    userModel.find({"email" : req.body.email}).then((result)=>{
      if(result.length !== 0)
        res.status(403).send({err: "User already exists"});
      else{
        bcrypt.genSalt(10 ,  (err, salt)=>{
            if(err) { res.status(403).send({err: "Something went wrong in salt generation"}) }
            else
            {
              bcrypt.hash(req.body.password ,  salt ,  (err ,  hash)=>{
                if(err) { res.status(403).send({err: "Something went wrong "}) }
                else
                {
                  userModel.insertMany({name : req.body.name ,  email : req.body.email  ,  password : hash  }).then((result)=>{
                    res.status(200).send({ msg :  "User Registerd Sucessfully"})
                  }).catch((err)=>{
                    res.status(403).send({err: "Somethig went wrong"})
              
                  })
                }
                
              })
            }
        })

      }
    })
}
exports.loginData  = (req,res)=>{

//   userModel.findOne({email : req.body.email},(err,user)=>{
//     if(user){
//         if(req.body.password === user.password)
//             res.status(200).send({msg:"User login Successfully", id : user._id})
//         else
//             res.status(403).send({msg : "Incorrect Password"});
//     }
//     else
//         res.status(403).send({msg : "User not found"});
//   })

  userModel.find({"email" : req.body.email}).then((result)=>{

    if(result.length === 0)
    {
      res.status(403).send({msg : "User Not Found"})
    }
    else
    {
      bcrypt.compare(req.body.password ,  result[0].password , (err , status  )=>{
        if(err)
        {
          res.status(403).send({msg : "Something went Wrong"})
        }
        else{
          if(status  === true)
          {
            res.status(200).send({msg : "User Login Sucessfully" ,  id : result[0]._id})
          }
          else{
            res.status(403).send({msg : "Incorrect Password"});
          }
        }
      })
    }
  }).catch((err)=>{
    res.status(403).send({msg  : "Somethig went wrong"});
  })
}
exports.productFetch = (req,res)=>{ 
  productModel.find()
  .then((result) => {
      res.status(200).send(JSON.stringify(result));
  })
  .catch ((err) => {
      res.status(403).send({msg : "Something went wrong"})
  });
}

exports.cartAddData = (req,res)=>{
      productModel.find({"_id" : req.body.row}).then((result)=>{
          if(result.length === 0)
            res.status(403).send({msg : "Product not Found"});
          else if(result[0].avl_quantity === 0)
              res.status(403).send({msg : "Item is out of stocks"});
          else
          {
            productModel.updateOne({_id: req.body.row}, {$set:{avl_quantity : result[0].avl_quantity-1}}).then((r)=>{
              console.log(r);
            }).catch((err)=>{
              console.log(err);
              res.status(403).send({msg : "Something went wrong"});
            })
            cartModel.find({"product_id" : req.body.row}).then((cart)=>{
              if(cart.length === 0)
              {
                cartModel.insertMany({user_id : req.body.log, product_id : req.body.row, p_name : result[0].p_name, p_price : result[0].p_price, p_cat : result[0].p_cat,p_desc : result[0].p_desc,p_image : result[0].p_image}).then((r)=>{
                  res.status(200).send({msg : "Item added to Cart"});
                }).catch((err)=>{
                  console.log(err);
                  res.status(403).send({msg : "Something went wrong"});
                })
              }
              else
              {
                cartModel.updateOne({product_id : req.body.row}, {$set:{quantity : cart[0].quantity+1}}).then((r)=>{
                  res.status(200).send({msg : "Item added to Cart"});
                }).catch((err)=>{
                  console.log(err);
                  res.status(403).send({msg : "Something went wrong"});
                })
              }
            })
          }    
      })
}

exports.cartFetch = (req,res)=>{
  cartModel.find().then((result)=>{
    res.status(200).send(JSON.stringify(result));
  }).catch((err)=>{
    res.status(403).send({msg : "Something went wrong"});
  })
}

exports.decProd = (req,res)=>{
  cartModel.find({'product_id' : req.body.prod}).then((result)=>{
        if(result.length === 0)
          res.status(403).send({msg : "Product not found"});
        else
        {
            if(result[0].quantity === 1)
            {
              cartModel.deleteOne({product_id : req.body.prod}).then((r)=>{
                res.status(200).send({msg : "Item removed from cart"});
              }).catch((err)=>{
                console.log(err);
                res.status(403).send({msg : "Something went wrong"});
              });
            }
            else
            {
                cartModel.updateOne({product_id : req.body.prod},{$set:{quantity : result[0].quantity - 1}}).then((r)=>{
                    res.status(200).send({msg : "Item removed to Cart"})
                }).catch((err)=>{
                  console.log(err);
                  res.status(403).send({msg : "Something went wrong"});
                });
            }
            productModel.find({'_id' : req.body.prod}).then((product)=>{
                  
                productModel.updateOne({_id : req.body.prod},{$set:{avl_quantity : product[0].avl_quantity + 1}}).then((r)=>{
                    console.log(r);
                }).catch((err)=>{
                  console.log(err);
                });
            })
        }    
  })
}
exports.removeProd = (req,res)=>{
  cartModel.find({'product_id' : req.body.prod}).then((result)=>{
      if(result.length === 0)
        res.status(403).send({msg : "Product not found"});
      else
      {
        productModel.find({'_id' : req.body.prod}).then((product)=>{
          productModel.updateOne({_id : req.body.prod},{$set:{avl_quantity : product[0].avl_quantity + result[0].quantity}}).then((r)=>{
            console.log(r);
          }).catch((err)=>{
            console.log(err);
          })
        })
        cartModel.deleteOne({product_id : req.body.prod}).then((r)=>{
          res.status(200).send({msg : "Item removed from Cart"});
        }).catch((err)=>{
          res.status(403).send({msg : "Something went wrong"});
        })
      }
  })
}