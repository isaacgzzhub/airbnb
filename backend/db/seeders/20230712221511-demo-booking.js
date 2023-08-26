"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          startDate: new Date("2023-09-01"),
          endDate: new Date("2023-09-03"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          userId: 2,
          startDate: new Date("2023-09-05"),
          endDate: new Date("2023-09-10"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 3,
          userId: 3,
          startDate: new Date("2023-09-15"),
          endDate: new Date("2023-09-20"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 1,
          userId: 2,
          startDate: new Date("2023-10-01"),
          endDate: new Date("2023-10-07"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          userId: 3,
          startDate: new Date("2023-10-11"),
          endDate: new Date("2023-10-15"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 3,
          userId: 1,
          startDate: new Date("2023-10-20"),
          endDate: new Date("2023-10-27"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 1,
          userId: 3,
          startDate: new Date("2023-11-05"),
          endDate: new Date("2023-11-12"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          userId: 1,
          startDate: new Date("2023-11-15"),
          endDate: new Date("2023-11-20"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 3,
          userId: 2,
          startDate: new Date("2023-12-01"),
          endDate: new Date("2023-12-08"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 1,
          userId: 2,
          startDate: new Date("2023-12-15"),
          endDate: new Date("2023-12-22"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    await queryInterface.bulkDelete(options, null, {});
  },
};
