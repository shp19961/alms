const mongose = require("mongoose");

const dbconnection = () => {
  mongose
    .connect("mongodb://localhost:27017/UvxcelAttendance", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) =>
      console.log(`database connected on ${data.connection.host}`)
    );
};

module.exports = dbconnection;
