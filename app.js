const express = require('express');
var fs = require('fs');
const path = require('path');
const { errorMonitor } = require('stream');
const Car = require('./model/car');

const Count = require('./model/counter');

const Deleted = require('./model/deleted_slots');

const History = require('./model/history');

const Detail = require('./model/details');

const app = express();
const port = process.env.PORT || 8000;

require("./conn.js");
const static_path = path.join(__dirname, "/");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/register.hbs", (req, res) => {
    res.render("register");
});
app.get("/index", (req, res) => {
    res.render("index");
});
app.get("/history", (req, res) => {
    res.render("history");
})
app.get("/parking", (req, res) => {
    res.status(201).render("parking");
})

const updatedoc = async (id, newObj) => {
    try {
        const result = await Count.findByIdAndUpdate({ _id: id }, newObj, (err) => {
            if (err) throw err
        })
    } catch {
        console.log(err)
    }
}

const deleteDocOfDeleted = async (id) => {
    try {
        const d = await Deleted.findByIdAndDelete({ _id: id });
    } catch (err) {
        console.log(err);
    }
}
const deleteDocOfCount = async (id) => {
    try {
        const d = await Count.findByIdAndDelete({ _id: id });
    } catch (err) {
        console.log(err);
    }
}
const deleteDocOfDetail = async (id) => {
    try {
        const d = await Detail.findByIdAndDelete({ _id: id });
    } catch (err) {
        console.log(err);
    }
}
const deleteDocOfHistory = async (id) => {
    try {
        const d = await History.findByIdAndDelete({ _id: id });
    } catch (err) {
        console.log(err);
    }
}


app.post("/register", async (req, res) => {
    try {
        const number = req.body.number;
        const colour = req.body.colour;
        const company = req.body.company;
        const Model = req.body.Model;

        Count.findOne({}, (err, result) => {
            console.log(result);
            console.log("is is min??")
            if (err) throw err
            if (result == null) {
                const registerCount = new Count({
                    last_count: 0,
                    history_count: 0
                })
                const registerDetail = new Detail({
                    number: req.body.number,
                    colour: req.body.colour,
                    company: req.body.company,
                    Model: req.body.Model,
                    //slot: req.body.Model
                    slot: 1,
                })
                //const registerCarHistory = new History({
                //    id:1,
                //    time:Date(),
                //    number:req.body.number,
                //    colour: req.body.colour,
                //    company: req.body.company,
                //    Model: req.body.Model,
                //    //slot: req.body.Model
                //    slot:1,
                //})
                const registeredDetail = registerDetail.save();
                const regi = registerCount.save();
                //const registeredCarHistory=registerCarHistory.save();
                res.status(201).render("index");
            } else {
                const min = async () => {
                    try {
                        const stat = await Deleted.find().select({ deleted_slot: 1 }).sort({ deleted_slot: 1 });
                        //console.log(stat);
                        if (stat[0] == undefined) {
                            Detail.findOne({ number: req.body.number }, (err, hresult) => {
                                if (err) throw err
                                if (hresult != null) {
                                    fs.writeFile('./views/result.hbs', `<h2>already registered</h2><b>Car Plate Number:-</b> ${hresult.number}<br>
                                               <b>Car Company:-</b> ${hresult.company}<br>
                                               <b>Car colour:-</b> ${hresult.colour}<br>
                                               <b>Car model:-</b> ${hresult.Model}<br>
                                               <b>Slot Number:-</b> ${hresult.slot}<br>
                                               <a href="index"><button>exit</button></a>`, (err) => {
                                        if (err) throw err;
                                        console.log("updated")
                                    })
                                    res.status(201).render("result");
                                    console.log("don't need to register");
                                }
                                else {

                                    const registerDetail = new Detail({
                                        number: req.body.number,
                                        colour: req.body.colour,
                                        company: req.body.company,
                                        Model: req.body.Model,
                                        slot: result.last_count + 1
                                    })
                                    //const registerCarHistory = new History({
                                    //    id:result.history_count+1,
                                    //    time:Date(),
                                    //    number:req.body.number,
                                    //    colour:req.body.colour,
                                    //    company:req.body.company,
                                    //    Model:req.body.Model,
                                    //    slot:result.last_count+1
                                    //})
                                    //console.log(result.last_count)
                                    const registeredDetail = registerDetail.save();
                                    //const registeredCarHistory=registerCarHistory.save();
                                    var newObj = {
                                        last_count: result.last_count,
                                        history_count: result.history_count
                                    }
                                    console.log(newObj.last_count)
                                    updatedoc(result._id, newObj);
                                    res.status(201).render("index");
                                }

                            })
                        }
                        else {
                            Detail.findOne({ number: req.body.number }, (err, hresult) => {
                                if (err) throw err
                                if (hresult != null) {
                                    fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                                    <div class="container">
                                    <div class="card mb-3" style="width: 33rem;" >
                                    <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                                        class="card-img-top img-fluid" alt="Parking lot image">
                                    <div class="card-body">
                                        <h1 class="card-title">Already Registered</h1>
                                        <p class="card-text">
                                        <b>Car Plate Number:-</b> ${hresult.number}<br>
                                               <b>Car Company:-</b> ${hresult.company}<br>
                                               <b>Car colour:-</b> ${hresult.colour}<br>
                                               <b>Car model:-</b> ${hresult.Model}<br>
                                               <b>Slot Number:-</b> ${hresult.slot}<br>
                                    
                                        </p>
                                      <a href="index"><button class="btn btn-outline-success">Exit</button></a>
                                    </div>
                                    </div>
                                  </div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                                  `, (err) => {
                                        if (err) throw err;
                                        console.log("updated")
                                    })
                                    res.status(201).render("result");
                                    console.log("don't need to register");


                                }
                                else {

                                    const registerDetail = new Detail({
                                        number: req.body.number,
                                        colour: req.body.colour,
                                        company: req.body.company,
                                        Model: req.body.Model,
                                        slot: stat[0].deleted_slot
                                    })
                                    //const registerCarHistory=new History({
                                    //    id:result.history_count+1,
                                    //    time:Date(),
                                    //    number:req.body.number,
                                    //    colour:req.body.colour,
                                    //    company:req.body.company,
                                    //    Model:req.body.Model,
                                    //    slot:stat[0].deleted_slot
                                    //})
                                    //console.log(result.last_count)
                                    var newObj = {
                                        last_count: result.last_count,
                                        history_count: result.history_count
                                    }
                                    console.log(newObj.last_count)
                                    updatedoc(result._id, newObj);
                                    deleteDocOfDeleted(stat[0]._id);
                                    const registeredDetail = registerDetail.save();
                                    //const registeredCarHistory=registerCarHistory.save();
                                    res.status(201).render("index");
                                }

                            })




                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
                min();



            }
        })

        //console.log(req.body.number);
    } catch (error) {
        res.status(400).send(error);
    }
})
app.post("/reciept", async (req, res) => {
    try {
        const number = req.body.number;
        //finding registered car details from history 
        Detail.findOne({ number: req.body.number }, (err, result) => {
            if (err) throw err;
            //We found one car detail that means it's registered 
            //check counters collection to see which slot in available
            if (result != null) {
                // we find that do we have last_counter and history_counter from counters collection
                Count.findOne({}, (err, countRecord) => {
                    console.log(countRecord);

                    if (err) throw err
                    if (countRecord == null) {
                        const registerCount = new Count({
                            last_count: 1,
                            history_count: 1
                        })
                        const registerCar = new Car({
                            number: req.body.number,
                            colour: result.colour,
                            company: result.company,
                            Model: result.Model,
                            //slot: req.body.Model
                            slot: 1,
                        })
                        const registerCarHistory = new History({
                            id: 1,
                            time: Date(),
                            number: req.body.number,
                            colour: result.colour,
                            company: result.company,
                            Model: result.Model,
                            //slot: req.body.Model
                            slot: 1,
                        })
                        const registeredCar = registerCar.save();
                        const regi = registerCount.save();
                        const registeredCarHistory = registerCarHistory.save();
                        fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        <div class="container">
                        <div class="card mb-3" style="width: 33rem;" >
                        <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                            class="card-img-top img-fluid" alt="Parking lot image">
                        <div class="card-body">
                            <h1 class="card-title">Parking Reciept</h1>
                            <p class="card-text">
                            <b>Car Plate Number:-</b> ${registerCar.number}<br>
                        <b>Car Company:-</b> ${registerCar.company}<br>
                        <b>Car colour:-</b> ${registerCar.colour}<br>
                        <b>Car model:-</b> ${registerCar.Model}<br>
                        <b>Slot Number:-</b> ${registerCar.slot}<br>
                        <form action="history" method="POST">
                        <button class="btn btn-outline-secondary">parking history</button>
                        </form>
                            </p>
                          <a href="index"><button class="btn btn-outline-success">Exit</button></a>
                        </div>
                        </div>
                      </div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                      `, (err) => {
                            if (err) throw err;
                            console.log("updated")
                        })
                        res.status(201).render("result");
                    }
                    else {
                        Car.findOne({ number: req.body.number }, (err, carRecord) => {
                            if (err) throw err;
                            //console.log(carRecord)
                            if (carRecord == null) {
                                const min = async () => {
                                    try {
                                        const stat = await Deleted.find().select({ deleted_slot: 1 }).sort({ deleted_slot: 1 });
                                        //console.log(stat);
                                        if (stat[0] == undefined) {
                                            const registerCar = new Car({
                                                number: req.body.number,
                                                colour: result.colour,
                                                company: result.company,
                                                Model: result.Model,
                                                slot: countRecord.last_count + 1
                                            })
                                            const registerCarHistory = new History({
                                                id: countRecord.history_count + 1,
                                                time: Date(),
                                                number: result.number,
                                                colour: result.colour,
                                                company: result.company,
                                                Model: result.Model,
                                                slot: countRecord.last_count + 1
                                            })
                                            //console.log(result.last_count)
                                            const registeredCar = registerCar.save();
                                            const registeredCarHistory = registerCarHistory.save();
                                            var newObj = {
                                                last_count: countRecord.last_count + 1,
                                                history_count: countRecord.history_count + 1
                                            }
                                            //console.log(newObj.last_count)
                                            console.log("yeah")
                                            console.log(registeredCar);
                                            updatedoc(countRecord._id, newObj);
                                            fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                                            <div class="container">
                                            <div class="card mb-3" style="width: 33rem;">
                                            <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                                                class="card-img-top img-fluid" alt="Parking lot image">
                                            <div class="card-body">
                                                <h1 class="card-title">Parking Reciept</h1>
                                                <p class="card-text">
                                                <b>Car Plate Number:-</b> ${registerCar.number}<br>
                                            <b>Car Company:-</b> ${registerCar.company}<br>
                                            <b>Car colour:-</b> ${registerCar.colour}<br>
                                            <b>Car model:-</b> ${registerCar.Model}<br>
                                            <b>Slot Number:-</b> ${registerCar.slot}<br>
                                            <form action="history" method="POST">
                                            <button class="btn btn-outline-secondary">parking history</button>
                                            </form>
                                                </p>
                                                <a href="index"><button cclass="btn btn-outline-success">Exit</button></a>
                                            </div>
                                          </div>
                                          </div>
                                          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                                          `, (err) => {
                                                if (err) throw err;
                                                console.log("updated")
                                            })
                                            res.status(201).render("result");
                                        }
                                        else {
                                            const registerCar = new Car({
                                                number: req.body.number,
                                                colour: result.colour,
                                                company: result.company,
                                                Model: result.Model,
                                                slot: stat[0].deleted_slot
                                            })
                                            const registerCarHistory = new History({
                                                id: countRecord.history_count + 1,
                                                time: Date(),
                                                number: result.number,
                                                colour: result.colour,
                                                company: result.company,
                                                Model: result.Model,
                                                slot: stat[0].deleted_slot
                                            })
                                            var newObj = {
                                                last_count: countRecord.last_count,
                                                history_count: countRecord.history_count + 1
                                            }
                                            console.log(newObj.last_count)
                                            updatedoc(countRecord._id, newObj);
                                            deleteDocOfDeleted(stat[0]._id);
                                            const registeredCar = registerCar.save();
                                            const registeredCarHistory = registerCarHistory.save();
                                            fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                                            <div class="container">
                                            <div class="card mb-3" style="width: 33rem;">
                                            <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                                                class="card-img-top img-fluid" alt="Parking lot image">
                                            <div class="card-body">
                                                <h1 class="card-title">Parking Reciept</h1>
                                                <p class="card-text">
                                                <b>Car Plate Number:-</b> ${registerCar.number}<br>
                                            <b>Car Company:-</b> ${registerCar.company}<br>
                                            <b>Car colour:-</b> ${registerCar.colour}<br>
                                            <b>Car model:-</b> ${registerCar.Model}<br>
                                            <b>Slot Number:-</b> ${registerCar.slot}<br>
                                            <form action="history" method="POST">
                                            <button class="btn btn-outline-secondary">parking history</button>
                                            </form>
                                                </p>
                                                <a href="index"><button class="btn btn-outline-success">Exit</button></a>
                                            </div>
                                          </div>
                                          </div>
                                          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                                          `, (err) => {
                                                if (err) throw err;
                                                console.log("updated")
                                            })
                                            res.status(201).render("result");
                                        }
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                                min();

                            }
                            else {
                                fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                                <div class="container">
                                <div class="card mb-3"style="width: 33rem;">
                                <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                                    class="card-img-top img-fluid" alt="Parking lot image">
                                <div class="card-body">
                                    <h1 class="card-title">Parked Already</h1>
                                    <p class="card-text">
                                    
                                    </p>
                                  <a href="index"><button class="btn btn-outline-success">Exit</button></a>
                                </div>
                              </div>
                              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
                              `, (err) => {
                                    if (err) throw err;
                                })
                                res.status(201).render("result");
                            }
                        })




                    }
                })

                //console.log(result);
                //fs.writeFile('./views/result.hbs',`<h2>Car Details</h2><b>Car Plate Number:-</b> ${result.number}<br>
                //                               <b>Car Company:-</b> ${result.company}<br>
                //                              <b>Car colour:-</b> ${result.colour}<br>
                //                             <b>Car model:-</b> ${result.Model}<br>
                //                             <b>Slot Number:-</b> ${result.slot}<br>
                //                           <a href="index"><button>exit</button></a>`,(err)=>{
                //if(err)throw err;
                //console.log("updated")
                //})
            }
            else {
                fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                <div class="container">
                <div class="card mb-3" style="width: 33rem;">
                <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                    class="card-img-top img-fluid" alt="Parking lot image">
                <div class="card-body">
                    <h1 class="card-title">Please register first</h1>
                    <p class="card-text">
                    <b><a href="register.hbs"
                                style="text-decoration:none" style="color: skyblue"><button class="btn btn-outline-primary">Register Now</button></a></b>
                    </p>
                    <a href="index"><button class="btn btn-outline-success">Exit</button></a>
                </div>
              </div>
              </div>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
              `, (err) => {
                    if (err) throw err;
                })
                res.status(201).render("result");
            }

            //document.getElementById("output").innerHTML=`${result.number}`
        });

        //console.log(req.body.number);
    } catch (error) {
        res.status(400).send(error);
    }
})


app.post("/colour", async (req, res) => {
    try {
        //const number=req.body.number;
        History.find({ colour: req.body.colour }, (err, result) => {
            if (err) throw err;
            //console.log(result.colour);
            console.log(result);
            if (result != null) {
                fs.writeFile('./views/history.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            <div class="container"></br>
            <a href="index"><button class="btn btn-outline-success">exit</button></a>
                
            `, (err) => {
                    if (err) throw err;
                    console.log("updated")
                })
                result.forEach(element => {
                    fs.appendFile('./views/history.hbs', `<p class="card-text"><b>Car Plate Number:-</b> ${element.number}<br>
                <b>Car Company:-</b> ${element.company}<br>
                <b>Car colour:-</b> ${element.colour}<br>
                <b>Car model:-</b> ${element.Model}<br>
                <b>Date of parking:-</b>${element.time}<br>
                <b>Slot number:-</b>${element.slot}<br><hr>
                </p>
                `, (err) => {
                        if (err) throw err;
                        console.log("updated")
                    })
                });

                fs.appendFile('./views/history.hbs', `</div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
            `, (err) => {
                    if (err)
                        throw err;
                    console.log("updated");
                })
                res.status(201).render("history");
            }
            else {
                fs.writeFile('./views/result.hbs', `
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            <div class="container">
            
            <h1 class="card-title">no car of this colour is parked here!</h1><br><br>
            
            
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
            `, (err) => {
                    if (err) throw err;
                })
                res.status(201).render("history");
            }

            //document.getElementById("output").innerHTML=`${result.number}`
        });

        //console.log(req.body.number);
    } catch (error) {
        res.status(400).send(error);
    }
})


app.post("/history", async (req, res) => {
    try {
        //find all the documents available in histories collection
        History.find({}, (err, result) => {
            if (err) throw err;
            //console.log(result);
            //console.log(result.colour);
            //console.log(result);
            if (result != null) {
                fs.writeFile('./views/history.hbs', "", (err) => {
                    if (err) throw err;
                    //console.log("updated")
                })
                fs.writeFile('./views/history.hbs', `
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
<div class="container">

<form action="colour" method="POST">
<div class="col-md-4">
<label for="cars">Choose a car:</label>
<select name="colour" id="cars" class="form-select">
<option value="white">White</option>
<option value="black">Black</option>
<option value="blue">Blue</option>
<option value="yellow">Yellow</option>
<option value="red">Red</option>
</select>
</div>

<input type="submit" class="btn btn-outline-secondary" value="Colour Filter">
<br>
</form>
<a href="index"><button class="btn btn-outline-success">exit</button></a>
`, (err) => {
                    if (err) throw err;
                    //console.log("updated")
                })



                result.forEach(element => {
                    //console.log(element)
                    fs.appendFile('./views/history.hbs', `<p class="card-text"><b>Car Plate Number:-</b> ${element.number}<br>
                    <b>Car Company:-</b> ${element.company}<br>
                    <b>Car colour:-</b> ${element.colour}<br>
                    <b>Car model:-</b> ${element.Model}<br>
                    <b>Date of parking:-</b> ${element.time}<br>
                    <b>Slot number:-</b> ${element.slot}<br><hr><br>
                    </p>`, (err) => {
                        if (err) throw err;
                        //console.log("updated")
                    })

                });

                fs.appendFile('./views/history.hbs', `
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossorigin="anonymous"></script>
                `, (err) => {
                    if (err)
                        throw err;
                    console.log("updated");
                })

            }
            else {
                fs.writeFile('./views/result.hbs', `
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            <div class="container">
            <h1 class="card-title">No car of this color is parked here!</h1>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
            `, (err) => {
                    if (err) throw err;
                })
            }
            res.status(201).render("history");

            //document.getElementById("output").innerHTML=`${result.number}`
        }).sort({ id: 1 });

        //console.log(req.body.number);
    } catch (error) {
        res.status(400).send(error);
    }
});

const deleteDocOfCar = async (_id) => {
    try {
        const result = await Car.findByIdAndDelete(_id);
        //console.log(result);
    } catch (err) {
        console.log(err);
    }
}

app.post("/delete", async (req, res) => {
    try {
        const number = req.body.number;
        Car.findOne({ number: req.body.number }, (err, result) => {
            if (err) throw err;
            //console.log(result.colour);
            if (result != null) {
                //console.log(result);
                console.log(result._id);
                deleteDocOfCar(result._id);
                const deletedSlot = new Deleted({
                    deleted_slot: result.slot
                })
                const r = deletedSlot.save();
                //console.log("sorting**********************");
                const minn = async () => {
                    try {
                        const stat = await Deleted.find().select({ deleted_slot: 1 }).sort({ deleted_slot: 1 });
                        if (stat != null) {
                            console.log(stat[0].deleted_slot);
                        }

                    } catch (err) {
                        console.log(err);
                    }
                }
                minn();


                //console.log("hey bhagwan")

                Count.findOne(({}), (err, ans) => {
                    if (err) throw err
                    //console.log(ans);


                    var newObj = {
                        last_count: ans.last_count,
                        delete_count: result.slot,
                        is_delete: true,

                    }
                    //console.log(newObj);
                    updatedoc(ans._id, newObj)
                    // Count.find({}).sort({last_count:1}).limit(1);
                    //Count.updateOne(ans,newObj,(err)=>{
                    //if(err)throw err
                    //  console.log(ans)
                    //})
                    //console.log(ans)
                    Count.update({ _id: ans._id }, {
                        $push: {
                            "available_slots.$[]": result.slot
                        }
                    })
                })
                fs.writeFile('./views/result.hbs', `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
             <div class="container">
                <div class="card mb-3" style="width: 33rem;">
                <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                    class="card-img-top img-fluid" alt="Parking lot image">
                <div class="card-body">
                    <h1 class="card-title">Car Details</h1>
                    <p class="card-text">
                    <b>Car Company:-</b> ${result.company}<br>
                    <b>Car colour:-</b> ${result.colour}<br>
                    <b>Car model:-</b> ${result.Model}<br>
                    <b>Slot Number:-</b> ${result.slot}<br>
                    <h3>Slot ${result.slot} is available now<h3>
                    </p>
                    <a href="index"><button class="btn btn-outline-success">Exit</button></a>
                </div>
                </div>
                </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
            `, (err) => {
                    if (err) throw err;

                })
            }
            else {
                fs.writeFile('./views/result.hbs', `
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    
                <div class="card mb-3" style="width: 33rem;">
                <img src="https://images.unsplash.com/photo-1495435229349-e86db7bfa013?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=900&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FyIHBhcmtpbmcgbG90fHx8fHx8MTYyOTM3OTAzMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200"
                    class="card-img-top img-fluid" alt="Parking lot image">
                <div class="card-body">
            
            <h1 class="card-title">You didn't park here!</h1><br>
            <a href="index"><button class="btn btn-outline-success">exit</button></a>
            </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
            `, (err) => {
                    if (err) throw err;
                })
            }

            //document.getElementById("output").innerHTML=`${result.number}`
            res.status(201).render("result");
        });

        //console.log(req.body.number);
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/exit", (req, res) => {
    try {
        Car.find({}, (err, result) => {
            result.forEach(element => {
                deleteDocOfCar(element._id)
            })
        })
        Count.find({}, (err, result) => {
            result.forEach(element => {
                deleteDocOfCount(element._id)
            })
        })
        Detail.find({}, (err, result) => {
            result.forEach(element => {
                deleteDocOfDetail(element._id)
            })
        })
        Deleted.find({}, (err, result) => {
            result.forEach(element => {
                deleteDocOfDeleted(element._id)
            })
        })
        History.find({}, (err, result) => {
            result.forEach(element => {
                deleteDocOfHistory(element._id)
            })
        })

        res.status(201).render("index");
    } catch (e) {
        console.log(e);
    }
})
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});