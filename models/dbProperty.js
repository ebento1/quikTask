import { DataTypes } from "sequelize";

/**
 *
 * @returns {object}
 */
export function primaryKey() {
  return {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  };
}

/**
 * Generates a configuration for a foreign key field.
 * @param {string} model
 * @param {string} key
 * @returns {object}
 */
export function foreignKey(model, key) {
  return {
    type: DataTypes.BIGINT,
    foreignKey: true,
    references: {
      model: model,
      key: key,
    },
  };
}

/**
 *
 * @param {integer} max
 */
export function stringNotNull(max) {
  return {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, max],
    },
  };
}

export function stringNull(max) {
  return {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, max],
    },
  };
}

export function enumNotNull() {
  return {
    type: DataTypes.ENUM,
    allowNull: false,
  };
}

export function datetimeNotNull() {
  return {
    type: DataTypes.DATE,
    allowNull: false,
  };
}

export function intNotNull() {
  return {
    type: DataTypes.BIGINT,
    allowNull: false,
  };
}

export function intNull() {
  return {
    type: DataTypes.BIGINT,
    allowNull: true,
  };
}

export function boolNotNull() {
  return {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  };
}

export function dateNow() {
  return {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  };
}

export function dateNotNull() {
  return {
    type: DataTypes.DATE,
    allowNull: false,
  };
}

/**
 * Generates a configuration for additional options.
 * @returns {object}
 */
export function options() {
  return {
    timestamps: false,
    freezeTableName: false,
  };
}
