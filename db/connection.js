const mongose = require("mongoose");

const dbconnection = () => {
  mongose
    .connect('mongodb://alms-mongodb:LLXgzHFTLDumql8vQgUzBFm6RhRGL4q7NCnTNdcxOAzhxNHxVqwlMA7H9aoWsHPAiErjt0vSFAgL9gqTHi4nDg==@alms-mongodb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@alms-mongodb@', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) =>
      console.log(`database connected on ${data.connection.host}`)
    );
};

module.exports = dbconnection;
