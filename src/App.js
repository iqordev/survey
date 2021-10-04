// import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import "survey-react/survey.css";
import * as Survey from "survey-react";
import { submitResults } from "./api/api";

function App() {
  const [surveyJSON, setsurveyJSON] = useState(null);
  const [surveyData, setSurveyData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.addEventListener("message", function (data) {
      try {
        // console.log(data.data);
        const postedData = JSON.parse(data.data);
        console.log(postedData);

        postedData?.token
          ? setSurveyData(postedData)
          : setsurveyJSON(postedData);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <div>
      {error ? (
        <p>Update app version</p>
      ) : (
        <Survey.Survey
          json={JSON.stringify(surveyJSON)}
          onStarted={() => {
            console.log("survey showing");
          }}
          onComplete={(e) =>
            submitResults(
              {
                formId: surveyData.id,
                jsonData: JSON.stringify(e.data),
              },
              surveyData.token
            )
          }
        />
      )}
    </div>
  );
}

export default App;
