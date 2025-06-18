const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("thoughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("Conectado com sucesso!");
} catch (error) {
  console.log("Houve um erro: ", error);
}

module.exports = sequelize;
