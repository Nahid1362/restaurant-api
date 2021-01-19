/********************************************************************************** 
*  WEB422 –Assignment1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
*   No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*  Name: Nahid Mohammadzadeh Student ID:101296192     Date:
*Heroku Link: _______________________________________________________________
*
*********************************************************************************/

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://dbUser:14531453@cluster0.z39jt.mongodb.net/sample_restaurants?retryWrites=true&w=majority");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
//process environment port or 8080

app.use(bodyParser.json());
app.use(cors());



db.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    }).catch((err) => {
        console.log(err);
    });

app.get('/', (req, res) => {
    res.status(200).json({msg: 'API is working.'});
});

app.get('/api/restaurants/:id', (req, res) => {
    const id = req.params.id;
    db.getRestaurantById(id).then(restaurant => {
        if (restaurant)
            res.status(200).json(restaurant);
        else
            res.status(200).json({ msg: 'Id not found' })
    }).catch(error => {
        console.log('Id not foud');
        res.status(500).json({ error: 'Id not foud' });
    });
});

// : /api/restaurants?page=1&perPage=5&borough=Bronx
app.get('/api/restaurants', (req, res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const borough = req.query.borough;
    db.getAllRestaurants(page, perPage, borough).then(restaurants => {
        res.status(200).json(restaurants);
    }).catch(err => {
        console.log('Invalid parameters');
        res.status(500).json({ error: err.message });
    });
})

// curl -d '{"address":{"coord":[-73.8786113,40.8502883],"building":"2300","street":"Southern Boulevard","zipcode":"10460"},"borough":"Bronx","cuisine":"American","grades":[{"date":"2014-05-28T00:00:00.000Z","grade":"A","score":11},{"date":"2013-06-19T00:00:00.000Z","grade":"A","score":4},{"date":"2012-06-15T00:00:00.000Z","grade":"A","score":3}],"name":"New Restaurant","restaurant_id":"409999"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/restaurants
app.post("/api/restaurants", (req, res) => {
    db.addNewRestaurant(req.body)
        .then((msg) => {
            console.log(msg);
            res.status(201).json({ message: msg });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

// /api/restaurants/5eb3d668b31de5d588f4292
app.put("/api/restaurants/:id", (req, res) => {
    const id = req.params.id;
    db.updateRestaurantById(req.body, id)
        .then((msg) => {
            console.log(msg);
            res.status(201).json({ message: msg });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
});

app.delete('/api/restaurants/:id', (req, res) => {
    const id = req.params.id;
    db.deleteRestaurantById(id).then((message) => {
        res.status(204).json({ msg: message });
    }).catch(error => {
        res.status(500).json({ error: error.message });
    });
});





