const errorMiddleware = (err,req,res,next)=>{
    console.log(err)
// client side
//    res.status(500).send({
//        success:false,
//        message:'some error ocurred in the server'
//    });

//server side
   res.status(500).render('pages/error')
}

module.exports = errorMiddleware