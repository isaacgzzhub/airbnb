"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Jane",
          lastName: "Doe",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Juan",
          lastName: "Perez",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Alice",
          lastName: "Smith",
          email: "user3@user.io",
          username: "WonderAlice",
          hashedPassword: bcrypt.hashSync("password4"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Bob",
          lastName: "Brown",
          email: "user4@user.io",
          username: "BobBuilder",
          hashedPassword: bcrypt.hashSync("password5"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Charlie",
          lastName: "Chaplin",
          email: "user5@user.io",
          username: "ComedyKing",
          hashedPassword: bcrypt.hashSync("password6"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Diana",
          lastName: "Prince",
          email: "user6@user.io",
          username: "WonderWoman",
          hashedPassword: bcrypt.hashSync("password7"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Edward",
          lastName: "Stark",
          email: "user7@user.io",
          username: "EdTechie",
          hashedPassword: bcrypt.hashSync("password8"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Fiona",
          lastName: "Green",
          email: "user8@user.io",
          username: "GreenFairy",
          hashedPassword: bcrypt.hashSync("password9"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "George",
          lastName: "Martin",
          email: "user9@user.io",
          username: "BookWorm",
          hashedPassword: bcrypt.hashSync("password10"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
