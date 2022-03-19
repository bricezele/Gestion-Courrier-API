/**
 * Project gestion-courrier-api
 * File FakeData
 * Path src/utils
 * Created by BRICE ZELE
 * Date: 08/03/2022
 */

const faker = require('faker');
faker.locale = 'fr';
export const FakeData = {
    user: {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        email: faker.internet.email(),
        phone_number: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        country: faker.address.country(),
        facebook: faker.internet.url(),
        twitter: faker.internet.url(),
        linkedin: faker.internet.url(),
        youtube: faker.internet.url(),
        aboutMe: faker.lorem.word(),
        comment: faker.lorem.word(),
        phone: faker.phone.phoneNumberFormat(),
    },
};
