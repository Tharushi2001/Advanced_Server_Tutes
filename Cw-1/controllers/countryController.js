// const axios = require("axios");

// // Function to fetch country details
// const getCountryDetails = async (req, res) => {
//     try {
//         const { name } = req.query; // Get country name from query parameter

//         if (!name) {
//             return res.status(400).json({ error: "Country name is required" });
//         }

//         // Fetch country data from RestCountries API
//         const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);

//         if (!response.data || response.data.length === 0) {
//             return res.status(404).json({ error: "Country not found" });
//         }

//         const country = response.data[0]; // Get the first matching country
//         const countryInfo = {
//             name: country.name.common,
//             capital: country.capital ? country.capital[0] : "N/A",
//             currency: country.currencies ? Object.keys(country.currencies)[0] : "N/A",
//             languages: country.languages ? Object.values(country.languages) : ["N/A"],
//             flag: country.flags.png,
//         };

//         res.status(200).json(countryInfo);
//     } catch (error) {
//         console.error("Error fetching country data:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

// module.exports = { getCountryDetails };


const axios = require("axios");

// Function to fetch full list of countries or specific country details
const getCountryDetails = async (req, res) => {
    try {
        const { name } = req.query; // Get country name from query parameter

        if (!name) {
            // If no country name is provided, fetch the full list of countries with details
            const response = await axios.get('https://restcountries.com/v3.1/all');
            
            // Extract relevant country information from the response
            const countries = response.data.map(country => ({
                name: country.name.common,
                capital: country.capital ? country.capital[0] : "N/A",
                currency: country.currencies ? Object.keys(country.currencies)[0] : "N/A",
                languages: country.languages ? Object.values(country.languages) : ["N/A"],
                flag: country.flags.png,
            }));

            res.status(200).json(countries);
        } else {
            // If country name is provided, fetch details for the specific country
            const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);

            if (!response.data || response.data.length === 0) {
                return res.status(404).json({ error: "Country not found" });
            }

            const country = response.data[0]; // Get the first matching country
            const countryInfo = {
                name: country.name.common,
                capital: country.capital ? country.capital[0] : "N/A",
                currency: country.currencies ? Object.keys(country.currencies)[0] : "N/A",
                languages: country.languages ? Object.values(country.languages) : ["N/A"],
                flag: country.flags.png,
            };

            res.status(200).json(countryInfo);
        }
    } catch (error) {
        console.error("Error fetching country data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getCountryDetails };
