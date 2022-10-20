import flat from 'flat';
const { unflatten } = flat;

const config = unflatten(process.env, {
  delimiter: "__",
  transformKey: function (key) {
    return key.toLowerCase();
  }
});

export default config;
