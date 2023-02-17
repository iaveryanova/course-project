const config = require("./config");
const { Sequelize, DataTypes } = require('sequelize');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');


const app = express()
app.use(cors({
  origin: true, //"http://localhost:3000",
  credentials: true,
}));
const port = 3020;
app.use(express.json());
app.use(cookieParser());

const cookie_options = {
  maxAge: 1000 * 60 * 30, // 30 minutes
  httpOnly: false,
  secure: false // http
}



const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'mysql' 
  });

const User = require('./models/User.js')(sequelize)

sequelize.sync({ alter: true})
  

// app.get('/', function (req, res) {
//   res.status(200).send('Hello world!!!!')
// })


app.post('/api/register', async (req, res) => {
  const {firstName, lastName, email, login, password, token} = req.body
  let hash_password = crypto.createHash('md5').update(password).digest('hex');
  console.log(hash_password, password);
  const user = await User.create({firstName, lastName, email, login, password: hash_password, token});
  res.status(200).json({ message: 'Register successfully'});
  return;
});


app.post('/api/login', async (req, res) => {
  console.log(req.body);
  let hash_password = crypto.createHash('md5').update(req.body.password).digest('hex');
  const user = await User.findOne({ where: { login: req.body.login, password: hash_password, is_deleted: false } });
  if (user === null) {
    res.sendStatus(404);
  } else {
    console.log(JSON.stringify(user));
    let generate_token = crypto.createHash('md5').update(new Date().toLocaleString() + JSON.stringify(user)).digest('hex');
    user.set({
      token: generate_token,
      last_login: new Date()
    });
    await user.save();
    res.cookie('token', generate_token, cookie_options);
    res.status(200).json({message: 'Login successfully'});
  }

  return;
});


app.post('/api/logout', async (req, res) => {
  let token = req.cookies['token'];
  if(token){

    const user = await User.findOne({where:{token}});
    user.set({
      token: null
    })
    await user.save();
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout' });

  }

  return;
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



