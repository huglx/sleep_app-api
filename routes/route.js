const { Router } = require("express")
const Test = require("../models/testModel")
const router = Router()

router.get("/test", async(req, res) =>{
    const test = await Test.find({})

    res.status(200).json(test)
})
  
  router.post('/create', async (req, res) => {
    // Test.insertMany(
    //   [
    //     { title: "Scooby" },
    //     { title: "Rambo" },
    //     { title: "Johny boy" }
    //   ],
    //   function(err, result) {
    //     if (err) {
    //       res.send(err);
    //     } else {
    //       res.send(result);
    //     }
    //   }
    // );
    const test = new Test({
      title: req.body.title
    })
    await test.save(function (err, test){
      if(err){
        res.send(err.message)
      }else{
        res.status(200).json({
          message: "No error"
        })
      }
    })
  })

module.exports = router
