const axios = require('axios');
const LogDao = require('../dao/LogDao');

class CountryController {
  static async getCountries(req, res) {
    try {
      // Fetch country data from the RestCountries API
      const response = await axios.get('https://restcountries.com/v3.1/all');

      // Map the response to the desired format
      const countries = response.data.map(country => ({
        name: country.name.common,
        capital: country.capital ? country.capital[0] : null,
        currencies: country.currencies ? Object.values(country.currencies).map(c => c.name) : [],
        languages: country.languages ? Object.values(country.languages) : [],
        flag: country.flags.svg
      }));

      // Log the action
      await LogDao.createLog(req.userId, 'Fetched countries', 'User  fetched country data.');

      // Send the response with the country data
      res.json(countries);
    } catch (error) {
      // Handle errors from the API call
      console.error('Error fetching countries:', error.message);
      res.status(500).json({ error: 'Failed to fetch countries. Please try again later.' });
    }
  }

  static async getCountryByName(req, res) {
    const { name } = req.params;
  
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      const country = response.data[0];
  
      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }
  
      const countryDetails = {
        name: country.name.common,
        capital: country.capital ? country.capital[0] : null,
        currencies: country.currencies ? Object.values(country.currencies).map(c => c.name) : [],
        languages: country.languages ? Object.values(country.languages) : [],
        flag: country.flags.svg
      };
  
      await LogDao.createLog(req.userId, 'Fetched country details', `User fetched details for ${name}.`);
  
      res.json(countryDetails);
    } catch (error) {
      console.error('Error fetching country details:', error.message);
      res.status(500).json({ error: 'Failed to fetch country details. Please try again later.' });
    }
  }
  
}

module.exports = CountryController;