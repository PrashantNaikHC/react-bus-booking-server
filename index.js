const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(bodyParser.json());

const SERVICE_PROVIDERS = [
  {
    service_provider_name: "Vishal Travels",
    service_provider_id: "123456",
    services: [
      {
        route_id: "123",
        image:
          "https://media.istockphoto.com/photos/white-passenger-bus-picture-id135327019?k=20&m=135327019&s=612x612&w=0&h=YJneXYFReSVuKSIFOy5wGIygeLeb1UquX4BWLk-MluI=",
        from: "Bangalore",
        to: "Hyderabad",
        type: "Semi Sleeper AC",
        Fare: 600,
        available_seats: 20,
        total_seats: 40,
      },
      {
        route_id: "456",
        image:
          "https://gst-contracts.s3.amazonaws.com/uploads/bcc/cms/asset/avatar/20856/29447821047_38bb23cd92_b.jpg",
        from: "Pune",
        to: "Chennai",
        type: "Garuda AC",
        Fare: 1600,
        available_seats: 12,
        total_seats: 20,
      },
      {
        route_id: "789",
        image:
          "https://w0.peakpx.com/wallpaper/417/897/HD-wallpaper-volvo-9800-15m-buses-busplusmex-mexico-movilbus.jpg",
        from: "New Delhi",
        to: "Jharkhand",
        type: "Garuda AC",
        Fare: 1640,
        available_seats: 7,
        total_seats: 20,
      },
    ],
  },

  {
    service_provider_name: "Vijayanand Travels",
    service_provider_id: "456789",
    services: [
      {
        route_id: "489",
        image:
          "https://media.istockphoto.com/photos/white-passenger-bus-picture-id135327019?k=20&m=135327019&s=612x612&w=0&h=YJneXYFReSVuKSIFOy5wGIygeLeb1UquX4BWLk-MluI=",
        from: "Bangalore",
        to: "Chennai",
        type: "Semi Sleeper AC",
        Fare: 1000,
        available_seats: 30,
        total_seats: 40,
      },
      {
        route_id: "156",
        image:
          "https://www.mods4u.in/bsi/img/2020/VRL-Yellow-1587936146-BUSSID-WWW-MODS4U-IN-1.jpeg",
        from: "Pune",
        to: "Kochin",
        type: "Garuda AC",
        Fare: 2600,
        available_seats: 1,
        total_seats: 20,
      },
      {
        route_id: "236",
        image:
          "https://w0.peakpx.com/wallpaper/417/897/HD-wallpaper-volvo-9800-15m-buses-busplusmex-mexico-movilbus.jpg",
        from: "Assam",
        to: "Bihar",
        type: "Garuda AC",
        Fare: 3200,
        available_seats: 10,
        total_seats: 20,
      },
    ],
  },

  {
    service_provider_name: "Govinda Roadlines",
    service_provider_id: "789123",
    services: [
      {
        route_id: "741",
        image:
          "https://gst-contracts.s3.amazonaws.com/uploads/bcc/cms/asset/avatar/20856/29447821047_38bb23cd92_b.jpg",
        from: "Mumbai",
        to: "Goa",
        type: "Semi Sleeper AC",
        Fare: 1200,
        available_seats: 0,
        total_seats: 40,
      },
      {
        route_id: "852",
        image:
          "https://www.india.com/wp-content/uploads/2018/09/2b196e2232721bc6da22534df89d9dfc_555X416_1.jpg",
        from: "Bangalore",
        to: "Mangalore",
        type: "Garuda AC",
        Fare: 1200,
        available_seats: 20,
        total_seats: 20,
      },
      {
        route_id: "963",
        image:
          "https://w0.peakpx.com/wallpaper/417/897/HD-wallpaper-volvo-9800-15m-buses-busplusmex-mexico-movilbus.jpg",
        from: "Goa",
        to: "Ahmedabad",
        type: "Garuda AC",
        Fare: 2600,
        available_seats: 12,
        total_seats: 20,
      },
    ],
  },
];

const BOOKINGS = [];

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// query the service providers
app.get("/providers", (req, res, next) => {
  const serviceProviders = SERVICE_PROVIDERS.map((service) => {
    return {
      name: service.service_provider_name,
      id: service.service_provider_id,
    };
  });
  res.status(200).json({ data: serviceProviders });
});

// query the services of a service provider, requires "service_provider" param in the request body
app.get("/services", (req, res, next) => {
  const serviceProvider = SERVICE_PROVIDERS.filter(
    (service) => service.service_provider_id === req.body.service_provider_id
  );
  res.status(200).json({ data: serviceProvider });
});

app.post("/book", (req, res, next) => {
  const seats = req.body.seats;
  const providerId = req.body.service_provider_id;
  const routeId = req.body.route_id;
  const serviceProvider = SERVICE_PROVIDERS.find(
    (service) => service.service_provider_id === providerId
  );
  const route = serviceProvider.services.find(
    (route) => route.route_id === routeId
  );
  if (route.available_seats < seats) {
    res
      .status(400)
      .json({ data: `only ${route.available_seats} seats are available` });
    return;
  }
  route.available_seats = route.available_seats - seats;
  const booking = {
    booking_id: uuidv4(),
    route_id: routeId,
    service_provider_id: providerId,
  };
  BOOKINGS.push(booking);
  res.status(200).json({ data: booking });
});

app.listen(5000); // start Node + Express server on port 5000
