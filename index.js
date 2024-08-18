const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const {intializeZoho, Zoho} = require("zoho-crm-node")
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("successfully connected to MongoDB"))
.catch(error =>console.log(error))

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> {
    console.log(`server is started at port ${PORT}`)
})

const customerSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true }, // Matches phone from frontend
    name: { 
        firstName: { type: String, required: true }, // Matches firstname
        lastName: { type: String, required: true }   // Matches lastname
    },
    email: { type: String, required: true },         // Matches email
    address: { 
        street: { type: String, required: true },    // Matches address
        city: { type: String, required: true },      // Matches city
        state: { type: String, required: true },     // Matches state
        pincode: { type: String, required: true }    // Matches pincode
    },
    organization: { type: String, required: true }   // Matches organization
});

const Customer = mongoose.model('Customer', customerSchema);

app.post('/api/customers', async (req, res) => {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: 'Invalid data' });
    }
});

app.get('/api/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});