const { Sequelize, DataTypes } = require('sequelize');


  module.exports = (sequelize) => {
    const CustomFieldsCollection = sequelize.define('CustomFieldsCollection', {

        // name
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        // desc
        custom_field: {
            type: DataTypes.ENUM,
            values: [
                'field_integer_1',
                'field_integer_2',
                'field_integer_3',
                'field_string_1',
                'field_string_2',
                'field_string_3',
                'field_bool_1',
                'field_bool_2',
                'field_bool_3',
            ],
            allowNull: false,
        },

  }, {
    tableName: 'fields_collections'
  });
  return CustomFieldsCollection
}
