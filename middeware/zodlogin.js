const {z}= require("zod")
const requireBody = z.object({
   
    email:z.string().email(),
    password:z.string().max(18)
})

const zodLoginverify = (req,res,next)=>{
    const safeParse = requireBody.safeParse(req.body)

    if(!safeParse.success){
        res.status(411).json({
            messege :"Incorrect format of emailor password",
            error:safeParse.error.issues[0].message
        })
        return
    }
    req.body =safeParse.data
    next()
}
module.exports={    

    zodLoginverify
}