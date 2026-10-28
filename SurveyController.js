// import db from '../models/index.js';
// const SurveyResult = db.SurveyResult;

// export const saveSurveyResponse = async (req, res) => {
//     try {
//         const { user_id, username, survey_topic, responses } = req.body;

//         // .create() always inserts a new row, allowing multiple submissions
//         const newSurvey = await SurveyResult.create({
//             user_id,
//             username,
//             survey_topic,
//             responses
//         });

//         res.status(201).json({
//             message: "Survey saved successfully",
//             data: newSurvey
//         });
//     } catch (error) {
//         console.error("Error saving survey:", error);
//         res.status(500).json({
//             message: "Failed to save survey",
//             error: error.message
//         });
//     }
// };


import db from '../models/index.js';
const SurveyResult = db.SurveyResult;

export const saveSurveyResponse = async (req, res) => {
    try {
        const { user_id, username, survey_topic, responses } = req.body;

        const newSurvey = await SurveyResult.create({
            user_id,
            username,
            survey_topic,
            responses
        });

        res.status(201).json({
            message: "Survey saved successfully",
            data: newSurvey
        });
    } catch (error) {
        console.error("Error saving survey:", error);
        res.status(500).json({
            message: "Failed to save survey",
            error: error.message
        });
    }
};

// NEW: Fetch all submitted surveys
export const getAllSurveys = async (req, res) => {
    try {
        const surveys = await SurveyResult.findAll({
            order: [['createdAt', 'DESC']] // Shows newest submissions first
        });
        
        res.status(200).json(surveys);
    } catch (error) {
        console.error("Error fetching surveys:", error);
        res.status(500).json({
            message: "Failed to fetch surveys",
            error: error.message
        });
    }
};