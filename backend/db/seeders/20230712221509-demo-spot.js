"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: "123 Main St",
          city: "Anytown",
          state: "Anystate",
          country: "AnyCountry",
          lat: 123.456,
          lng: 123.456,
          name: "Test Spot",
          description: "This is a test spot.",
          price: 123.45,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          address: "456 Elm Street",
          city: "Laketown",
          state: "Clearstate",
          country: "LakeCountry",
          lat: 124.456,
          lng: 123.456,
          name: "Lakeside Villa",
          description:
            "Enjoy the calm serenity of this beautiful lakeside retreat.",
          price: 200.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          address: "789 Oak Avenue",
          city: "Forestville",
          state: "Woodstate",
          country: "ForestCountry",
          lat: 125.456,
          lng: 126.456,
          name: "Forest Cabin",
          description: "A cozy cabin in the midst of a peaceful forest.",
          price: 150.75,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: "159 Maple Drive",
          city: "Hillside",
          state: "Highstate",
          country: "MountainCountry",
          lat: 127.456,
          lng: 125.456,
          name: "Mountain Lodge",
          description: "A scenic spot atop the majestic mountains.",
          price: 250.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          address: "753 Birch Lane",
          city: "Beachville",
          state: "Coaststate",
          country: "OceanCountry",
          lat: 128.456,
          lng: 129.456,
          name: "Beachfront Bungalow",
          description: "Soak up the sun in this beachfront property.",
          price: 300.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          address: "951 Pine Place",
          city: "Valleyville",
          state: "Valleystate",
          country: "RiverCountry",
          lat: 129.456,
          lng: 128.456,
          name: "Valley Farmstay",
          description: "Experience the countryside at this lovely valley farm.",
          price: 180.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: "246 Cedar Court",
          city: "Rainville",
          state: "Rainstate",
          country: "CloudCountry",
          lat: 130.456,
          lng: 130.456,
          name: "Rainforest Treehouse",
          description: "Stay high among the trees in this unique treehouse.",
          price: 210.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          address: "864 Willow Way",
          city: "Islandville",
          state: "Islandstate",
          country: "SeaCountry",
          lat: 131.456,
          lng: 132.456,
          name: "Island Resort",
          description:
            "Experience island life at its finest at this luxury resort.",
          price: 350.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          address: "312 Redwood Road",
          city: "Skytown",
          state: "Airstate",
          country: "SkyCountry",
          lat: 133.456,
          lng: 131.456,
          name: "Sky High Penthouse",
          description: "Stunning views from this modern city penthouse.",
          price: 400.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: "624 Cherry Circle",
          city: "Desertville",
          state: "Sandstate",
          country: "DesertCountry",
          lat: 134.456,
          lng: 134.456,
          name: "Desert Oasis",
          description:
            "Find peace and tranquility in this secluded desert spot.",
          price: 220.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    await queryInterface.bulkDelete(options, null, {});
  },
};
