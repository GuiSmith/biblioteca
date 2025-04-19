const isProduction = process.env.NODE_ENV === "production";

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
          ssl: {
              require: true,
              rejectUnauthorized: false
          }
      },
      define: {
          timestamps: false,
          freezeTableName: true
      }
  })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
          dialect: "postgres",
          host: process.env.DB_HOST,
          define: {
              timestamps: false,
              freezeTableName: true
          }
      }
  );

export default sequelize;