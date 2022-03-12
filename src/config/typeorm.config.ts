/**
 * Project yoolearn-backend
 * File OrmConfig
 * Path src/config
 * Created by BRICE ZELE
 * Date: 18/08/2021
 */

export const TypeormConfig = {
    type: 'mongodb',
    url: process.env.MONGODB_CONNECTION_STRING,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    autoLoadEntities: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    /*      connectTimeout: Number(process.env.DATABASE_CONNECTION_TIME_OUT),
acquireTimeout: Number(process.env.DATABASE_ACQUIRE_TIMEOUT),
extra: {
connectionLimit: parseInt(
Number(process.env.DATABASE_CONNECTION_LIMIT),
),
},*/
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/**/*{.js,.ts}'],
    subscribers: ['dist/subscribers/**/*{.js,.ts}'],
    cli: {
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'src/observers/subscribers',
    },
};
