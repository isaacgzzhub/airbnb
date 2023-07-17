'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' }),
      Spot.hasMany(models.SpotImage,
        {
          foreignKey: 'spotId',
          onDelete: 'Cascade'
        }),
      Spot.hasMany(models.Booking,
        {
          foreignKey: 'spotId',
          onDelete: 'Cascade'
        }),
      Spot.hasMany(models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'Cascade'
        })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    avgRating: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getAvgRating();
      },
      async set() {
        throw new Error('Do not try to set the `avgRating` value!');
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });

  Spot.prototype.getAvgRating = async function() {
    const reviews = await this.getReviews();
    if (!reviews.length) {
      return 0;  // or whatever default value you want
    }
    const sum = reviews.reduce((acc, curr) => acc + curr.stars, 0);
    return sum / reviews.length;
  }

  return Spot;
};
