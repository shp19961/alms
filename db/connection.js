const mongose = require("mongoose");

const dbconnection = () => {
  mongose
    .connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) =>
      console.log(`database connected on ${data.connection.host}`)
    );
};

module.exports = dbconnection;
