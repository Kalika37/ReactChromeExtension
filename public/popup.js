function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
class HTTP {
  static POST(url, datas) {
    return new Promise((response, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open("POST", url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      // xhr.setRequestHeader("Content-Type", "application/json");
      const data = new FormData()
      for (const key in datas) {
        data.append(key, datas[key])
      }
      xhr.onload = () => response(xhr.response);

      xhr.send(data);
    })
  }
  static GET(url) {
    return new Promise((response, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("Get", url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
      xhr.onload = () => response(xhr.response);
      xhr.send();
    })
  }

}
document.addEventListener('DOMContentLoaded', function () {
  const newsTextArea = document.getElementById('news-text');
  const submitButton = document.getElementById('submit-button');
  const predictionResult = document.getElementById('prediction-result');
  const feedbackBtn = document.getElementById('feedback-btn');
  const feedbackSection = document.getElementById('feedback-section');
  const autoPasteButton = document.getElementById('auto-paste');
  const toggleContainer = document.querySelector('.toggle-container');
  const toggleSwitch = document.querySelector('.toggle-switch');
  const title = document.getElementById('title');
  const newsTextLabel = document.getElementById('news-text-label');
  const feedbackHeader = document.getElementById('feedback-header');
  const feedbackNewsText = document.getElementById('feedback-news-text');
  const feedbackForm = document.getElementById('feedback-form');
  const socialShareDiv = document.getElementById('social-share');
  const shareFacebookButton = document.getElementById('share-facebook');
  const shareTwitterButton = document.getElementById('share-twitter');
  const shareWhatsAppButton = document.getElementById('share-whatsapp');

  let currentLanguage = 'en';
  // Fake news prediction function
  function predictNews(content) {
    if (content.includes('breaking news')) {
      return currentLanguage === 'en' ? 'This news might be fake!' : 'यो समाचार शायद झुटो हो!';
    } else {
      return currentLanguage === 'en' ? 'This news looks not fake.' : 'यो समाचार सही देखिन्छ।';
    }
  }

  // Update social share buttons
  function updateSocialShareButtons(message) {
    const currentUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(message);

    shareFacebookButton.onclick = function () {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${text}`,
        '_blank'
      );
    };

    shareTwitterButton.onclick = function () {
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=${currentUrl}`,
        '_blank'
      );
    };

    shareWhatsAppButton.onclick = function () {
      window.open(`https://wa.me/?text=${text} ${currentUrl}`, '_blank');
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
    autoPasteButton.textContent = currentLanguage === 'en' ? 'Auto Paste' : 'स्वचालित पेस्ट गर्नुहोस्';
    newsTextArea.placeholder =
      currentLanguage === 'en' ? 'Paste or type news content here...' : 'यहाँ समाचारको पाठ टाइप वा पेस्ट गर्नुहोस्...';

    const radioButtons = document.querySelectorAll('.radio-group input');

    if (radioButtons[0].nextElementSibling) {
      radioButtons[0].nextElementSibling.textContent = currentLanguage === 'en' ? 'Real News' : 'साँचो समाचार';
      radioButtons[1].nextElementSibling.textContent = currentLanguage === 'en' ? 'Fake News' : 'झुटो समाचार';
    }
  }

  // Auto-paste clipboard content
  autoPasteButton.addEventListener('click', function () {
    navigator.clipboard
      .readText()
      .then((text) => {
        newsTextArea.value = text;
      })
      .catch((err) => {
        alert(
          currentLanguage === 'en'
            ? `Failed to read clipboard contents: ${err}`
            : `क्लिपबोर्ड सामग्री पढ्न असफल: ${err}`
        );
      });
  });
  // Predict news when submit button is clicked
  submitButton.addEventListener('click', function () {
    const newsContent = newsTextArea.value.trim();
    if (newsContent) {
      const result = predictNews(newsContent);
      predictionResult.textContent = result;
      predictionResult.style.display = 'block';
      socialShareDiv.style.display = 'block';
      if (getCookie('csrftoken')) {
        HTTP.POST("http://localhost:8000/report_news", {
          error: "hi hello",
          csrfmiddlewaretoken: getCookie('csrftoken'),
          chromeruntimeid:chrome.runtime.id
        })
      } else {
        HTTP.GET("http://localhost:8000/get_post_authenticateToken").then(res => {
          const data = JSON.parse(res)
          setCookie("_csrftoken", data.csrf, 4)
          setCookie("csrftoken", data.csrf, 4)
          HTTP.POST("http://localhost:8000/report_news", {
            error: "hi hello",
            csrfmiddlewaretoken: data.csrf,
            chromeruntimeid:chrome.runtime.id

          })
        })
        updateSocialShareButtons(result);
      }
    } else {
      alert(
        currentLanguage === 'en'
          ? 'Please enter some news content!'
          : 'कृपया केही समाचार प्रविष्ट गर्नुहोस्!'
      );
    }
  });

  // Toggle feedback mode
  feedbackBtn.addEventListener('click', function () {
    const isFeedbackVisible = feedbackSection.style.display !== 'none';
    feedbackSection.style.display = isFeedbackVisible ? 'none' : 'block';
    newsTextLabel.style.display = isFeedbackVisible ? 'block' : 'none';
    newsTextArea.style.display = isFeedbackVisible ? 'block' : 'none';
    submitButton.style.display = isFeedbackVisible ? 'block' : 'none';
    socialShareDiv.style.display = isFeedbackVisible ? 'none' : 'none';
    predictionResult.style.display = isFeedbackVisible ? 'none' : 'none';
    feedbackBtn.textContent = isFeedbackVisible
      ? currentLanguage === 'en'
        ? 'Switch to Feedback Mode'
        : 'प्रतिक्रिया मोडमा जानुहोस्'
      : currentLanguage === 'en'
        ? 'Close Feedback Mode'
        : 'प्रतिक्रिया मोड बन्द गर्नुहोस्';
  });

  // Language toggle
  toggleContainer.addEventListener('click', function () {
    toggleContainer.classList.toggle('active');
    currentLanguage = currentLanguage === 'en' ? 'ne' : 'en';
    updateLanguage();
  });

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
});
