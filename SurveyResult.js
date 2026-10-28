export const SurveyResult = (sequelize, DataTypes) => {
    const Survey = sequelize.define("SurveyResult", {
        // Explicitly set an auto-incrementing ID as the Primary Key
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // user_id is no longer the primary key, so duplicates are allowed
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        survey_topic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        responses: {
            // Storing the answer object directly (e.g., {"1": "SA", "2": "A"})
            type: DataTypes.JSON, 
            allowNull: false
        }
    });

    return Survey;
};