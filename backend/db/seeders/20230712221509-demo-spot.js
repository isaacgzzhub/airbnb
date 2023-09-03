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
          description:
            "A delightful urban escape located in the heart of Anytown. Experience a blend of modern amenities with a touch of classic charm at this exquisite spot.",
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
            "Nestled on the banks of a pristine lake, the Lakeside Villa offers a sublime retreat. Wake up to mesmerizing sunrises and relax with the gentle sounds of lapping waters in the evening.",
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
          description:
            "Tucked away amidst the towering trees of Forestville, this rustic cabin promises a rejuvenating escape from the hustle and bustle. A haven for nature lovers, expect to be greeted by the chirping of birds and the rustling of leaves.",
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
          description:
            "Positioned on the mountain's peak, the Mountain Lodge offers panoramic vistas of the valley below. Ideal for those seeking solitude and inspiration, the crisp mountain air and starlit nights are sure to captivate.",
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
          description:
            "Step out directly onto the golden sands from the Beachfront Bungalow. The rhythmic sound of the waves and the salty sea breeze promise a rejuvenating beach getaway like no other.",
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
          description:
            "Set in the verdant landscapes of Valleyville, this farmstay transports you to simpler times. Engage in quaint countryside activities or simply relax with a book overlooking the serene valley.",
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
          description:
            "Elevate your vacation—literally—with a stay at the Rainforest Treehouse. Perched high amidst the lush canopy, it's an enchanting experience with nature's orchestra playing just for you.",
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
            "At Island Resort, every day feels like a tropical vacation. Surrounded by turquoise waters, indulge in water sports or simply lounge on the beach sipping your favorite cocktail.",
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
          description:
            "Sky High Penthouse sits atop Skytown, offering unparalleled views of the cityscape. Decked with luxurious amenities, it's urban living taken to the next level.",
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
            "Desert Oasis is a sanctuary amidst the vast desert landscapes of Desertville. Adorned with palm trees and a tranquil pool, it's a mirage turned into a luxurious reality.",
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
