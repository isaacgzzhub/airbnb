"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          reviewId: 1,
          url: "https://hips.hearstapps.com/hmg-prod/images/tci-villa-amaizing-grace-2021-058-1616076982.jpg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 2,
          url: "https://hips.hearstapps.com/hmg-prod/images/casa-kimball-welcome-beyond-dr-1615987576.jpg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 3,
          url: "https://hips.hearstapps.com/hmg-prod/images/rosewood-mayakoba-residence-1616077172.jpg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 4,
          url: "https://hips.hearstapps.com/hmg-prod/images/gold-coast-turnkey-rentals-1615931167.png?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 5,
          url: "https://hips.hearstapps.com/hmg-prod/images/barbados-villa-kiko-2020-002-1616077015.jpg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 6,
          url: "https://hips.hearstapps.com/hmg-prod/images/tradewinds-aerial-1615990443.jpg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 7,
          url: "https://hips.hearstapps.com/hmg-prod/images/mariott-villa-rosemary-beach-1615993002.png?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 8,
          url: "https://hips.hearstapps.com/hmg-prod/images/villa-lovango-jpeg-1612382335.jpeg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 9,
          url: "https://hips.hearstapps.com/hmg-prod/images/cbr-villa-fivebedroomsignatureskyvilla-2615-2020-5667-1-1615995843.jpg?crop=1xw:1xh;center,top&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          reviewId: 10,
          url: "https://hips.hearstapps.com/hmg-prod/images/stags-leap-winery-manor-house-porch-view-1-1573227691.jpg?crop=0.668xw:1.00xh;0.310xw,0&resize=980:*",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    await queryInterface.bulkDelete(options, null, {});
  },
};
