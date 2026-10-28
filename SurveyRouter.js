// import { saveSurveyResponse } from "../controllers/SurveyController.js";

// export const SurveyRouter = (app) => {
//     app.post("/save-survey", saveSurveyResponse);
// };

import { saveSurveyResponse, getAllSurveys } from "../controllers/SurveyController.js";

export const SurveyRouter = (app) => {
    app.post("/save-survey", saveSurveyResponse);
    // NEW: Route to fetch surveys for the dashboard
    app.get("/get-surveys", getAllSurveys);
};