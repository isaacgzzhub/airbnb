"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          spotId: 1,
          url: "https://hips.hearstapps.com/hmg-prod/images/atelier-house-villa-rentals-barbados-caribbean-4-640x480-c-center-1615922068.jpg?crop=1xw:1xh;center,top&resize=980:*",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 2,
          url: "https://hips.hearstapps.com/hmg-prod/images/ocean-spray-plum-guide-1615923188.png?crop=1xw:1xh;center,top&resize=980:*",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 3,
          url: "https://hips.hearstapps.com/hmg-prod/images/st-barts-villa-k-2020-062-1616076852.jpg?crop=1xw:1xh;center,top&resize=980:*",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 4,
          url: "https://hips.hearstapps.com/hmg-prod/images/ani-villas-anguilla-cg1-11-long-1616005841.jpg?crop=1xw:1xh;center,top&resize=980:*",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 5,
          url: "https://hips.hearstapps.com/hmg-prod/images/loscabos-res-joyadelmar-ext-hero-uhd-1615923541.jpeg?crop=1xw:1xh;center,top&resize=980:*",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 6,
          url: "https://hips.hearstapps.com/hmg-prod/images/onefinestay-pacific-palisades-1615925484.png?crop=1xw:1xh;center,top&resize=980:*",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 7,
          url: "https://hips.hearstapps.com/hmg-prod/images/rosemarybeach-res-sugarwhite-uhd-1615928580.jpeg?crop=1xw:1xh;center,top&resize=980:*",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 8,
          url: "https://hips.hearstapps.com/hmg-prod/images/cayman-islands-villa-kempa-kai-2020-021-1616076929.jpg?crop=1xw:1xh;center,top&resize=980:*",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 9,
          url: "https://hips.hearstapps.com/hmg-prod/images/ka-ehu-kai-marriott-villas-1615930743.jpg?crop=1xw:1xh;center,top&resize=980:*",
          preview: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          spotId: 10,
          url: "https://hips.hearstapps.com/hmg-prod/images/villa-lands-end-ofs-1615929371.png?crop=1xw:1xh;center,top&resize=980:*",
          preview: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await queryInterface.bulkDelete(options, null, {});
  },
};
