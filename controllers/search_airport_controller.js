import postgres from "../db/dbconnect.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"; 

const getByIataCode = asyncHandler(async (req, res) => {
    const {iata_code} = req.params; 

    if(iata_code.trim() === ""){
        throw new ApiError(400, "Iata Code requires !!");
    }

    // const postgres = await getClient();

    try {
        const airportResult = await postgres.query(`
        SELECT 
            a.id, a.icao_code, a.iata_code, a.name AS airport_name, a.type, a.latitude_deg, a.longitude_deg, a.elevation_ft, a.city_id, a.country_id
        FROM 
            Airport a
        WHERE 
            a.iata_code = $1
        `, [iata_code]);

        if (airportResult.rows.length === 0) {
            return res.status(200).json(new ApiResponse(200, {}, "Airport not found"));
        }

        const airport = airportResult.rows[0];

        const cityResult = await postgres.query(`
            SELECT 
                c.id, c.name AS city_name, c.country_id, c.is_active, c.lat AS city_lat, c.long AS city_long
            FROM 
                City c
            WHERE 
                c.id = $1
        `, [airport.city_id]);

        const countryResult = await postgres.query(`
            SELECT 
                co.id, co.name AS country_name, co.country_code_two, co.country_code_three, co.mobile_code, co.continent_id
            FROM 
                Country co
            WHERE 
                co.id = $1
        `, [airport.country_id]);

        const city = cityResult.rows[0];
        const country = countryResult.rows[0];

        const response = {
            airport: {
                id: airport.id,
                icao_code: airport.icao_code,
                iata_code: airport.iata_code,
                name: airport.airport_name,
                type: airport.type,
                latitude_deg: airport.latitude_deg,
                longitude_deg: airport.longitude_deg,
                elevation_ft: airport.elevation_ft,
                address: {
                    city: {
                        id: city.id,
                        name: city.city_name,
                        country_id: city.country_id,
                        is_active: city.is_active,
                        lat: city.city_lat,
                        long: city.city_long
                    },
                    country: {
                        id: country.id,
                        name: country.country_name,
                        country_code_two: country.country_code_two,
                        country_code_three: country.country_code_three,
                        mobile_code: country.mobile_code,
                        continent_id: country.continent_id
                    }
                }
            }
        };

        // postgres.end();
       
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                response, 
                "details fetched successfuly !"
            )
        );
    } catch (error) {
        // postgres.end();

        throw new ApiError(500, "Something went wrong while fetching deatils !", error); 
    }
});

export {getByIataCode};