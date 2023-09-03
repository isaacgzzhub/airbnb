"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          review: "Great spot!",
          stars: 5,
          createdAt: daysAgo(10),
          updatedAt: daysAgo(10),
        },
        {
          spotId: 2,
          userId: 2,
          review: "Amazing location, loved it!",
          stars: 4,
          createdAt: daysAgo(30),
          updatedAt: daysAgo(30),
        },
        {
          spotId: 3,
          userId: 3,
          review: "The spot was decent, but could use some improvements.",
          stars: 3,
          createdAt: daysAgo(50),
          updatedAt: daysAgo(50),
        },
        {
          spotId: 1,
          userId: 2,
          review: "This has become my go-to spot. Highly recommend!",
          stars: 5,
          createdAt: daysAgo(70),
          updatedAt: daysAgo(70),
        },
        {
          spotId: 2,
          userId: 3,
          review: "Good for the price.",
          stars: 4,
          createdAt: daysAgo(100),
          updatedAt: daysAgo(100),
        },
        {
          spotId: 3,
          userId: 1,
          review:
            "Had an issue initially but the owner resolved it quickly. Overall good experience.",
          stars: 4,
          createdAt: daysAgo(130),
          updatedAt: daysAgo(130),
        },
        {
          spotId: 1,
          userId: 3,
          review: "Not what I expected. The pictures were misleading.",
          stars: 2,
          createdAt: daysAgo(160),
          updatedAt: daysAgo(160),
        },
        {
          spotId: 2,
          userId: 1,
          review: "A hidden gem! Will definitely come back.",
          stars: 5,
          createdAt: daysAgo(200),
          updatedAt: daysAgo(200),
        },
        {
          spotId: 4,
          userId: 2,
          review: "Average spot, nothing too special.",
          stars: 3,
          createdAt: daysAgo(230),
          updatedAt: daysAgo(230),
        },
        {
          spotId: 1,
          userId: 2,
          review: "Fantastic experience! Great amenities and a wonderful view.",
          stars: 5,
          createdAt: daysAgo(260),
          updatedAt: daysAgo(260),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options, null, {});
  },
};
