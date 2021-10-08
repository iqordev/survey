// import logo from "./logo.svg";
import './App.css'
import React, { useEffect, useState } from 'react'
import 'survey-react/survey.css'
import * as Survey from 'survey-react'
import { submitResults } from './api/api'

//sample json
// const jsonSample = {
//   title: 'iQorian Mobile App Survey',
//   description:
//     'This is to get feedback from the Test users of the iQorian mobile application.',
//   completedHtml: '<h3>Thank you for your feedback</h3>',
//   pages: [
//     {
//       name: 'page1',
//       elements: [
//         {
//           type: 'rating',
//           name: 'satisfaction',
//           title:
//             'How satisfied are you with the look and feel of the application?',
//           description: '(1 is the lowest and 5 is the highest)',
//           isRequired: true,
//         },
//         {
//           type: 'rating',
//           name: 'easeofuse',
//           title: 'How satisfied are you with the ease of use of the app?',
//           description: '(1 is the lowest and 5 is the highest)',
//           isRequired: true,
//         },
//         {
//           type: 'rating',
//           name: 'installonboarding',
//           title:
//             'How satisfied are you with the installation and onboarding experience of the app?',
//           description: '(1 is the lowest and 5 is the highest)',
//           isRequired: true,
//         },
//         {
//           type: 'checkbox',
//           name: 'mostimportant',
//           title: 'Which features of the app are MOST important to you?',
//           isRequired: true,
//           choices: [
//             { value: 'News', text: 'News & Updates' },
//             { value: 'Dashboard', text: 'Dashboard' },
//             { value: 'MyTaks', text: 'My Tasks' },
//             'Notifications',
//             { value: 'MyProfile', text: 'My Profile' },
//             { value: 'QuickLinks', text: 'Quick Links' },
//             { value: 'Surveys', text: 'Surveys' },
//           ],
//           choicesOrder: 'asc',
//         },
//         {
//           type: 'checkbox',
//           name: 'leastimportant',
//           title: 'Which features of the app are LEAST important to you?',
//           choices: [
//             {
//               value: 'News',
//               text: 'News & Updates',
//               visibleIf: "{mostimportant} notcontains 'News'",
//             },
//             {
//               value: 'Dashboard',
//               text: 'Dashboard',
//               visibleIf: "{mostimportant} notcontains 'Dashboard'",
//             },
//             {
//               value: 'MyTaks',
//               text: 'My Tasks',
//               visibleIf: "{mostimportant} notcontains 'MyTaks'",
//             },
//             {
//               value: 'Notifications',
//               text: 'Notifications',
//               visibleIf: "{mostimportant} notcontains 'Notifications'",
//             },
//             {
//               value: 'MyProfile',
//               text: 'My Profile',
//               visibleIf: "{mostimportant} notcontains 'MyProfile'",
//             },
//             {
//               value: 'QuickLinks',
//               text: 'Quick Links',
//               visibleIf: "{mostimportant} notcontains 'QuickLinks'",
//             },
//             {
//               value: 'Surveys',
//               text: 'Surveys',
//               visibleIf: "{mostimportant} notcontains 'Surveys'",
//             },
//           ],
//           choicesOrder: 'asc',
//         },
//         {
//           type: 'checkbox',
//           name: 'newfeatures',
//           title: 'What new features would you like to see in the next update?',
//           isRequired: true,
//           hasOther: true,
//           otherPlaceHolder: 'Please describe...',
//           choices: [
//             { value: 'Chat', text: 'Chat/QonnectPlus' },
//             { value: 'PayStubs', text: 'Pay stub' },
//             { value: 'TQ', text: ' TimeQey adjustments' },
//             { value: 'ProfileUpdate', text: 'Profile updates' },
//           ],
//           choicesOrder: 'asc',
//         },
//         {
//           type: 'comment',
//           name: 'impression',
//           title: 'What was your first impression of the app?',
//         },
//         {
//           type: 'comment',
//           name: 'confused',
//           title: 'What confused/annoyed you about the app?',
//         },
//         {
//           type: 'comment',
//           name: 'expectedfeatures',
//           title: 'What are the features you expected to find but didn’t?',
//         },
//         { type: 'comment', name: 'comments', title: 'Comments' },
//       ],
//     },
//   ],
//   isPublic: true,
//   showInList: false,
// }

function App() {
  const [surveyJSON, setsurveyJSON] = useState(null)
  const [surveyData, setSurveyData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    window.addEventListener('message', function (data) {
      try {
        // console.log(data.data);
        const postedData = JSON.parse(data.data)
        console.log(postedData)

        postedData?.token
          ? setSurveyData(postedData)
          : setsurveyJSON(postedData)
      } catch (error) {
        console.error(error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    })

    document.addEventListener('message', function (data) {
      try {
        // console.log(data.data);
        const postedData = JSON.parse(data.data)
        console.log(postedData)

        postedData?.token
          ? setSurveyData(postedData)
          : setsurveyJSON(postedData)
      } catch (error) {
        console.error(error)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  return (
    <>
      <div className='box'>
        {error ? (
          <p>Update app version</p>
        ) : surveyJSON ? (
          <Survey.Survey
            json={JSON.stringify(surveyJSON)}
            onStarted={(e) => {
              console.log('survey showing', e)
            }}
            onAfterRenderSurvey={(e) => {
              console.log('onAfterRenderSurvey', e)
              window.ReactNativeWebView &&
                window.ReactNativeWebView.postMessage(e.PageCount)
            }}
            onAfterRenderPage={(e) => {
              console.log('onAfterRenderPage', e)
              window.ReactNativeWebView &&
                window.ReactNativeWebView.postMessage(e.PageCount)
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
        ) : (
          <div class='row content'>
            <div className='center'>
              <span className='info'>
                There was a problem loading the form probably due to network
                connection. {'\n'}
                <br />
                Click the "try again" button to reload the form.
              </span>
              <button
                style={{ textDecorationLine: 'underline', cursor: 'pointer' }}
                onClick={() => {
                  console.log('clicked')
                  window.ReactNativeWebView &&
                    window.ReactNativeWebView.postMessage(0)
                  // setsurveyJSON(jsonSample)
                }}
              >
                try again
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
