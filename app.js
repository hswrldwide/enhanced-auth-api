const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Enhanced Authentication API',
        version: '1.0.0',
        description: 'API for managing user authentication with public/private profiles',
      },
    },
    apis: ['./routes/*.js'],
  };
  
  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;





