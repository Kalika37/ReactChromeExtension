import React, { useEffect, useRef, useState } from 'react'
import { SpinnerCircular } from 'spinners-react';
import "./content.css"
import "./style.css"
import "./styles.css"
export default function Main({ route }) {
    const referenceMenuDialog = useRef(document.createElement('dialog'))
    const MainUiButton = useRef(document.createElement('div'))
    const SettingFroResult = {
        onLoaded: (result) => {
        },
        onLoading: function () {
        },
        route
    }
    let recentSelectedText = ''
    useEffect(() => {
        const requestFakeNewsCheck = (content) => {
            SettingFroResult.onLoading()

            // 1. Send a message to the service worker requesting the news information
            if (window.chrome) {

                window.chrome.runtime.sendMessage({ command: 'CheckNewsForthis', clipboard: false, news: content }, (response) => {
                    SettingFroResult.onLoaded(response)
                });

            }
        }
        MainUiButton.current.onclick = () => {
            const options = [
                'Check Selected',
                'Open Detector UI',
                'Setting',
                'Send Feedback',
                'Report Issue'
            ]
            referenceMenuDialog.current.querySelector(".texter").innerHTML = ''
            for (let index = 0; index < options.length; index++) {
                let proceed = true
                if (index === 0) {
                    if (document.getSelection()) {
                        if (!document.getSelection().toString().trim()) {
                            proceed = false
                        } else {
                            recentSelectedText = document.getSelection().toString().trim()
                        }
                    } else {
                        proceed = false
                    }
                }
                if (proceed) {
                    const button = document.createElement("button")
                    button.innerHTML = options[index]
                    button.onclick = (e) => {
                        e.preventDefault()
                        if (index === 0) {
                            if (recentSelectedText) {
                                requestFakeNewsCheck(recentSelectedText)
                            }
                        }
                        if (index === 1) {
                            SettingFroResult.mainResultUIFrame.current.showModal()
                        }
                        if (index === 2) {
                            window.open(SettingFroResult.route)
                        }
                        if (index === 3) {
                            SettingFroResult.FeedBackFrame.current.showModal()
                        }
                        if (index === 4) {
                            SettingFroResult.ReportIssuesFrame.current.showModal()
                        }
                        referenceMenuDialog.current.close()
                    }
                    referenceMenuDialog.current.querySelector(".texter").appendChild(button)
                }

            }
            referenceMenuDialog.current.showModal()
            const rect = referenceMenuDialog.current.getBoundingClientRect()
            referenceMenuDialog.current.querySelector(".right").style.top = `${rect.height / 2 - 40}px`
            referenceMenuDialog.current.style.left = `calc(100vw - ${rect.width + 66}px)`
            referenceMenuDialog.current.style.top = `calc(100vh/2 - ${rect.height / 2 - 10}px)`
        }
        referenceMenuDialog.current.onclick = (e) => {
            const rect = referenceMenuDialog.current.getBoundingClientRect()
            if (e.x < rect.x || e.x > rect.x + rect.width + 5 || e.y < rect.y + 15 || e.y > rect.y + rect.height - 15) {
                referenceMenuDialog.current.close()
            }
        }

        referenceMenuDialog.current.focus = -1
        //Handling the keydown event to manage context menu up and down
        referenceMenuDialog.current.onkeydown = (e) => {
            e.preventDefault()
            // return
            if (e.key === "ArrowDown") {
                const buttons = referenceMenuDialog.current.querySelectorAll("button")
                if (referenceMenuDialog.current.focus === buttons.length - 1 || referenceMenuDialog.current.focus === -1) {
                    referenceMenuDialog.current.focus = 0
                    buttons[referenceMenuDialog.current.focus].focus();
                } else {
                    referenceMenuDialog.current.focus++;
                    buttons[referenceMenuDialog.current.focus].focus();
                }
            }
            if (e.key === "ArrowUp") {
                const buttons = referenceMenuDialog.current.querySelectorAll("button")
                if (referenceMenuDialog.current.focus <= 0) {
                    referenceMenuDialog.current.focus = buttons.length - 1
                    buttons[referenceMenuDialog.current.focus].focus();
                } else {
                    referenceMenuDialog.current.focus--;
                    buttons[referenceMenuDialog.current.focus].focus();
                }
            }
            if (e.key === "Enter") {
                const buttons = referenceMenuDialog.current.querySelectorAll("button")
                try {
                    buttons[referenceMenuDialog.current.focus].click()
                } catch (error) {

                }
            }
            return false
        }
        const intervak = setInterval(() => {
            if (window.chrome.runtime) {
                window.chrome.runtime.onMessage.addListener(function (response, sendResponse) {
                    if (response.action === "Context_Menu_clicked") {
                        requestFakeNewsCheck(response.text)
                    }
                })
                clearInterval(intervak)
            }
        }, 1000);
        return () => {

        }
    })

    return (
        <>
            <div className="inner" ref={MainUiButton}>
                <img src="https://kalika37.github.io/ReactBounceBallAndTodo/content-icon.jpg" alt="" />
            </div >
            <dialog className='mainMenuFrame menu' ref={referenceMenuDialog}>
                <div className="texter">
                    <button>Check Selected</button>
                    <button>Open Detector UI</button>
                    <button>Setting</button>
                    <button>Send Feedback</button>
                    <button>Report Issue</button>
                </div>
                <div className="right">

                </div>
            </dialog>
            <ResultFrame settings={SettingFroResult} />
            <FakeDetectorUI settings={SettingFroResult} />
            <FeedBackFrame settings={SettingFroResult} />
            <ReportIssuesFrame settings={SettingFroResult} />

        </>
    )
}
export function FakeDetectorUI({ settings }) {
    const mainResultUIFrame = useRef(document.createElement("dialog"))
    settings.mainResultUIFrame = mainResultUIFrame
    useEffect(() => {
        mainResultUIFrame.current.ShowModal = mainResultUIFrame.current.showModal
        const newsTextArea = document.getElementById('news-text');
        const feedbacktextarea = document.getElementById('news-text-fedback');
        const submitButton = document.getElementById('submit-button');
        const predictionResult = document.getElementById('prediction-result');
        const feedbackBtn = document.getElementById('feedback-btn');
        const feedbackSection = document.getElementById('feedback-section');
        const toggleContainer = document.querySelector('.toggle-container');
        // const toggleSwitch = document.querySelector('.toggle-switch');
        const title = document.getElementById('title');
        const newsTextLabel = document.getElementById('news-text-label');
        const feedbackHeader = document.getElementById('feedback-header');
        const feedbackNewsText = document.getElementById('feedback-news-text');
        const feedbackForm = document.getElementById('feedback-form');
        const socialShareDiv = document.getElementById('social-share');
        const shareFacebookButton = document.getElementById('share-facebook');
        const shareMore = document.getElementById('share-more');
        const shareTwitterButton = document.getElementById('share-twitter');
        const shareWhatsAppButton = document.getElementById('share-whatsapp');
        let currentLanguage = 'en';
        mainResultUIFrame.showModal = () => {
            predictionResult.firstElementChild.style.display = "none"
            mainResultUIFrame.current.ShowModal()
        }
        // Fake news prediction function
        predictionResult.firstElementChild.style.display = "none"
        function predictNews(content) {
            if (window.chrome) {
                predictionResult.firstElementChild.style.display = "block"
                predictionResult.style.display = "block"
                socialShareDiv.style.display = 'none'
                predictionResult.lastElementChild.style.display = 'none'
                window.chrome.runtime.sendMessage({ command: 'CheckNewsForthis', clipboard: true, news: content }, (results) => {
                    submitButton.disabled = false
                    newsTextArea.nextElementSibling.innerHTML = ''
                    predictionResult.firstElementChild.style.display = "none"
                    predictionResult.lastElementChild.style.display = 'block'
                    if (results.status) {
                        updateSocialShareButtons(content)
                        predictionResult.lastElementChild.querySelector(".description").innerHTML = results.news.description
                        predictionResult.lastElementChild.querySelector(".date").innerHTML = results.news.date
                        predictionResult.lastElementChild.querySelector(".source").innerHTML = results.news.source.title
                        predictionResult.lastElementChild.querySelector(".source").onclick = () => {
                            window.open(results.news.source.url)
                        }
                        predictionResult.lastElementChild.querySelector(".date").classList.add("remove")
                        predictionResult.lastElementChild.querySelector(".date").onclick = null
                        predictionResult.lastElementChild.querySelector("h3").innerHTML = results.news.title
                        socialShareDiv.style.display = 'block'

                    } else {
                        predictionResult.lastElementChild.querySelector(".description").innerHTML = "This is may be added by someone mistakely or intentionally"
                        predictionResult.lastElementChild.querySelector(".date").innerHTML = 'Report'
                        predictionResult.lastElementChild.querySelector(".source").innerHTML = ''
                        predictionResult.lastElementChild.querySelector(".date").classList.add("report")
                        predictionResult.lastElementChild.querySelector(".date").onclick = () => {
                            settings.ReportIssuesFrame.current.showModal()
                        }
                        predictionResult.lastElementChild.querySelector(".source").onclick = null
                        predictionResult.lastElementChild.querySelector("h3").innerHTML = "This is a Fake News"
                    }
                });
            }
        }
        // Update social share buttons
        function updateSocialShareButtons(message) {
            socialShareDiv.style.display = 'block'
            shareFacebookButton.onclick = function () {
                window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "facebook", searchfor: message })
            };
            shareTwitterButton.onclick = function () {
                window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "twitter", searchfor: message })

            };

            shareWhatsAppButton.onclick = function () {
                window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "whatsapp", searchfor: message })
            };
            shareMore.onclick = function () {
                window.chrome.runtime.sendMessage({ command: "ShareResult", shareto: "more", searchfor: message })
            };
        }
        // Update language
        function updateLanguage() {
            title.textContent = currentLanguage === 'en' ? 'Fake News Detection' : 'झुटो समाचार पत्ता लगाउने';
            newsTextLabel.textContent = currentLanguage === 'en' ? 'Enter the news text:' : 'समाचारको पाठ प्रविष्ट गर्नुहोस्:';
            feedbackHeader.textContent = currentLanguage === 'en' ? 'Insert News\' Text Here:' : 'यहाँ समाचारको पाठ राख्नुहोस्:';
            feedbackBtn.textContent =
                feedbackSection.style.display === 'none'
                    ? currentLanguage === 'en'
                        ? 'Switch to Feedback Mode'
                        : 'प्रतिक्रिया मोडमा जानुहोस्'
                    : currentLanguage === 'en'
                        ? 'Close Feedback Mode'
                        : 'प्रतिक्रिया मोड बन्द गर्नुहोस्';
            submitButton.textContent = currentLanguage === 'en' ? 'Predict' : 'पूर्वानुमान गर्नुहोस्';
            newsTextArea.placeholder =
                currentLanguage === 'en' ? 'Paste or type news content here...' : 'यहाँ समाचारको पाठ टाइप वा पेस्ट गर्नुहोस्...';

            const radioButtons = document.querySelectorAll('.radio-group input');

            if (radioButtons[0].nextElementSibling) {
                radioButtons[0].nextElementSibling.textContent = currentLanguage === 'en' ? 'Real News' : 'साँचो समाचार';
                radioButtons[1].nextElementSibling.textContent = currentLanguage === 'en' ? 'Fake News' : 'झुटो समाचार';
            }
            if (newsTextArea.nextElementSibling.textContent.trim()) {
                newsTextArea.nextElementSibling.innerHTML = currentLanguage === 'en'
                    ? 'Please enter some news content!'
                    : 'कृपया केही समाचार प्रविष्ट गर्नुहोस्!'
            }
            if (feedbacktextarea.nextElementSibling.textContent.trim()) {
                feedbacktextarea.nextElementSibling.innerHTML = currentLanguage === 'en'
                    ? 'Please enter some content!'
                    : 'कृपया केही सामग्री प्रविष्ट गर्नुहोस्!'
            }
        }
        socialShareDiv.style.display = 'none';
        // Predict news when submit button is clicked
        submitButton.addEventListener('click', function () {
            const newsContent = newsTextArea.value.trim();
            if (newsContent.length >= 5) {
                predictNews(newsContent);
                newsTextArea.value = ""
                submitButton.disabled = true

            } else {
                predictionResult.style.display = 'none';
                socialShareDiv.style.display = 'none';
                newsTextArea.nextElementSibling.innerHTML = currentLanguage === 'en'
                    ? 'Please enter some news content!(atleast 5 character)'
                    : 'कृपया केही समाचार प्रविष्ट गर्नुहोस्!'
            }
        });
        feedbackBtn.onclick = (e) => {
            e.preventDefault()
            const feedback = feedbacktextarea.value.trim();
            if (feedback.length >= 5) {
                feedbacktextarea.nextElementSibling.innerHTML = ""
                feedbacktextarea.value = ''
                // ...
                mainResultUIFrame.current.close()
                if (window.chrome) {
                    window.chrome.runtime.sendMessage({
                        command: "Feedback",
                        feedback
                    }, (response) => {
                    });
                }

            } else {
                // predictionResult.style.display = 'none';
                // socialShareDiv.style.display = 'none';
                feedbacktextarea.nextElementSibling.innerHTML = currentLanguage === 'en'
                    ? 'Please enter some content!(atleast 5 character)'
                    : 'कृपया केही सामग्री प्रविष्ट गर्नुहोस्!'
            }
        }


        // Language toggle
        toggleContainer.onclick = () => {
            toggleContainer.classList.toggle('active');
            currentLanguage = currentLanguage === 'en' ? 'ne' : 'en';
            updateLanguage();
        }

        // Feedback form submission
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const feedbackText = feedbackNewsText.value.trim();
            const feedbackStatus = feedbackForm.querySelector('input[name="news-status"]:checked').value;
            alert(
                currentLanguage === 'en'
                    ? `Feedback submitted! News: ${feedbackText}, Status: ${feedbackStatus}`
                    : `प्रतिक्रिया पेश भयो! समाचार: ${feedbackText}, स्थिति: ${feedbackStatus}`
            );
            feedbackForm.reset();
        });
        // Initialize language
        updateLanguage();
    })
    return (
        <dialog ref={mainResultUIFrame}>
            <div id='mainResultUIFrame' ref={mainResultUIFrame}>
                <div className="container">
                    <header>
                        <h3 id="title">Fake News Detection</h3>
                        <div id="language-switcher">
                            <div className="toggle-container" id="toggle-container">
                                <div className="toggle-switch" id="toggle-switch"></div>
                                <span className="label left" id="en-label">EN</span>
                                <span className="label right" id="ne-label">NE</span>
                            </div>
                            <img src="https://kalika37.github.io/ReactBounceBallAndTodo/fake-news-icon.png" alt="Logo" width="100px" height="70px" style={{ width: '100px' }} />
                        </div>
                    </header>

                    <div className="content">
                        <form id="news-form">
                            <label htmlFor="news-text" id="news-text-label">Enter the news text:</label>
                            <textarea id="news-text" placeholder="Paste or type news content here..."></textarea>
                            <div className="error"></div>
                            <button type="button" id="submit-button">Predict</button>
                        </form>

                        <p id="prediction-result">
                            <div className="loadingicon">
                                <SpinnerCircular thickness={200} speed={300} />
                            </div>
                            <div className="content-component">
                                <h3> </h3>
                                <div className="description">
                                </div>
                                <div className="date">
                                </div>
                                <div className="source report">

                                </div>
                            </div>
                        </p>
                        <div id="social-share" style={{
                            displa: "none"
                        }}>
                            <textarea id="news-text-fedback" placeholder="Enter Feedback..."></textarea>
                            <div className="error"></div>
                            <div className="button-group">
                                <button id="feedback-btn">Switch to Feedback Mode</button>
                            </div>
                            <h3>Share this result:</h3>
                            <div className="share-buttons">
                                <button className="share-button" id="share-facebook">
                                    <img src="https://facebook.com/favicon.ico" alt="" />
                                </button>
                                <button className="share-button" id="share-twitter">
                                    <img src="https://x.com/favicon.ico" alt="" />
                                </button>
                                <button className="share-button" id="share-whatsapp">
                                    <img src="https://cdn3.iconfinder.com/data/icons/social-media-chamfered-corner/154/whatsapp-512.png" alt="" />
                                </button>
                                <button className="share-button" id="share-more">
                                    more
                                </button>

                            </div>
                        </div>
                        <div id="feedback-section" style={{
                            displa: "none"
                        }}>
                            <h2 id="feedback-header">Insert News' Text Here:</h2>
                            <form id="feedback-form">
                                <textarea id="feedback-news-text" placeholder="Enter the news text here..." required></textarea>
                                <div className="radio-group">
                                    <label>
                                        <input type="radio" name="news-status" value="real" required /> Real News
                                    </label>
                                    <label>
                                        <input type="radio" name="news-status" value="fake" required /> Fake News
                                    </label>
                                </div>
                                <button type="submit">Submit Feedback</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )

}
export function ResultFrame({ settings }) {
    const reference = useRef(document.createElement('dialog'))
    const loading = useRef(document.createElement('div'))
    const resultframe = useRef(document.createElement('div'))
    settings.onLoaded = (results) => {
        if (!reference.current.open) {
            reference.current.showModal()
        }
        loading.current.style.display = "none"
        resultframe.current.style.display = 'block'
        if (results.status) {
            resultframe.current.querySelector(".description").innerHTML = results.news.description
            resultframe.current.querySelector(".date").innerHTML = results.news.date
            resultframe.current.querySelector(".source").innerHTML = results.news.source.title
            resultframe.current.querySelector(".source").onclick = () => {
                window.open(results.news.source.url)
            }
            resultframe.current.querySelector(".date").classList.add("remove")
            resultframe.current.querySelector(".date").onclick = null
            resultframe.current.querySelector("h3").innerHTML = results.news.title

        } else {
            resultframe.current.querySelector(".description").innerHTML = "This is may be added by someone mistakely or intentionally"
            resultframe.current.querySelector(".date").innerHTML = 'Report'
            resultframe.current.querySelector(".source").innerHTML = ''
            resultframe.current.querySelector(".date").classList.add("report")
            resultframe.current.querySelector(".date").onclick = () => {
                settings.ReportIssuesFrame.current.showModal()
            }
            resultframe.current.querySelector(".source").onclick = null
            resultframe.current.querySelector("h3").innerHTML = "This is a Fake News"
        }
    }
    settings.onLoading = () => {
        resultframe.current.style.display = 'none'
        loading.current.style.display = 'block'
        if (!reference.current.open) {
            reference.current.showModal()
        }
    }
    settings.resultframe = reference
    useEffect(() => {
        resultframe.current.style.display = 'none'
       
    })
    return <>
        <dialog className='result' ref={reference}>
            <div className="inner">
                <div className="loadingicon" ref={loading}>
                    <SpinnerCircular thickness={200} speed={300} />
                </div>
                <div className="content-component" ref={resultframe}>
                    <h3> News From Nepal</h3>
                    <div className="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi perferendis nisi eos aperiam veritatis vitae dolorum exercitationem corrupti praesentium ea, eligendi maxime alias minus dolorem dolore! Doloremque inventore voluptatem eius?
                    </div>
                    <div className="date">
                        2<sup>nd</sup> November
                    </div>
                    <div className="source report">

                    </div>
                </div>
            </div>
        </dialog>
    </>
}
export function FeedBackFrame({ settings }) {
    const reference = useRef(document.createElement('dialog'))
    const [feedback, setFeedback] = useState("")
    const [error, setError] = useState("")
    const onclickButton = () => {
        if (feedback.trim().length < 5) {
            setError("Feedback length must be greater then 5")
        } else {
            setError("")
            reference.current.close()
            if (window.chrome) {
                window.chrome.runtime.sendMessage({
                    command: "Feedback",
                    message:feedback
                }, (response) => {

                });
            }

        }
    }
    settings.FeedBackFrame = reference
    useEffect(() => {

    })
    return <>
        <dialog className='Response' ref={reference}>
            <div className="main">
                <h3>Send Feedback - Fake News Detector</h3>
                <fieldset>
                    <legend>Feedback Detail</legend>
                    <textarea name="feedback" placeholder='Enter Your Message...' id="issue" value={feedback} onChange={(e) => { setFeedback(e.target.value) }}></textarea>
                </fieldset>
                <div className="highlight error">
                    {error}
                </div>
                <button onClick={onclickButton}> Submit </button>
            </div>
        </dialog>
    </>
}
export function ReportIssuesFrame({ settings }) {
    const reference = useRef(document.createElement('dialog'))
    const [feedback, setFeedback] = useState("")
    const [error, setError] = useState("")
    const onclickButton = () => {
        if (feedback.trim().length < 5) {
            setError("Issue message length must be greater then 5")
        } else {
            setError("")
            reference.current.close()
            if (window.chrome) {
                window.chrome.runtime.sendMessage({
                    command: "ReportIssue",
                    message:feedback
                }, (response) => {

                });
            }

        }
    }
    settings.ReportIssuesFrame = reference
    useEffect(() => {

    })
    return <>
        <dialog className='Response' ref={reference}>
            <div className="main">
                <h3>Send Feedback - Fake News Detector</h3>
                <fieldset>
                    <legend>Feedback Detail</legend>
                    <textarea name="issue" placeholder='Enter the issue detail' id="issue" value={feedback} onChange={(e) => { setFeedback(e.target.value) }}></textarea>
                </fieldset>
                <div className="highlight error">
                    {error}
                </div>
                <button onClick={onclickButton}> Submit </button>
            </div>
        </dialog>
    </>
}
