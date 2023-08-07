const express = require('express')
const cors = require('cors')
const app=express();
app.use(cors());
const axios = require('axios')
async function getToken() {
    const url = "http://20.244.56.144/train/auth"; 
    const Body = {
            "companyName": "Yatra",
            "clientID": "bb569cc7-44ce-4286-9f4c-ff4230baba9c",
            "ownerName": "Indhra lochan Kumar bojjanapalli",
            "ownerEmail": "indra.lochans@gmail.com",
            "rollNo": "20VE1A6708",
            "clientSecret": "gVxwhOFwbQbXWUYh"
    };
    try {
        const response = await axios.post(url,Body);
        const accessToken = response.data;
        return accessToken
    } catch (error) {
        console.error('Error fetching access token:', error.message);
        throw error;
    }
}

app.get('/',async(req,res)=>{
    try {
        const resp = await getToken();
        const accessToken = resp.access_token
        console.log(accessToken);
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const url = "http://20.244.56.144/train/trains";
        const response = await axios.get(url, { headers });
        const trains = response.data.filter(train => {
            return train.departureTime.Hours!==0 && train.departureTime.Minutes>30
        })
        let price = trains.sort((a,b)=>{
            const priceA = (a.price.sleeper+a.price.AC)/2
            const priceB = (b.price.sleeper+b.price.AC)/2
            const diff = priceA-priceB
            if(diff!==0){
                return diff
            }
        })
        let tickets = price.sort((a,b)=>{
            const availableA = (a.seatsAvailable.sleeper + a.seatsAvailable.AC)/2
            const availableB = (b.seatsAvailable.sleeper + b.seatsAvailable.AC)/2
            const diff = availableA-availableB
            if(diff!==0){
                return diff;
            }
        })
        let departure = tickets.sort((a,b)=>{
            const departureA = new Date( a.departureTime.Hours,a.departureTime.Minutes + a.delayedBy,a.departureTime.Seconds);
            const departureB = new Date(b.departureTime.Hours,b.departureTime.Minutes + b.delayedBy,b.departureTime.Seconds);
            return departureA - departureB
        })
        res.json(departure)
    }catch(error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/train/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const resp = await getToken();
        const accessToken = resp.access_token;
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const url = `http://20.244.56.144:80/train/trains/${id}`;
        console.log(url);
        const response = await axios.get(url, { headers });
        const responseData = {
            trainName: response.data.trainName,
            trainNumber: response.data.trainNumber,
            departureTime: `${response.data.departureTime.Hours}:${response.data.departureTime.Minutes}`,
            seatsAvailable: {
                sleeper: response.data.seatsAvailable.sleeper,
                AC: response.data.seatsAvailable.AC
            },
            price: {
                sleeper: response.data.price.sleeper,
                AC: response.data.price.AC
            },
            delayedBy: response.data.delayedBy
        };
        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(5000,()=>{
    console.log("server began at port 5000 "+"http://localhost:5000/")
})
