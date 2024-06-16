const input = document.getElementById("input");
const message = document.getElementById("message");
const updatedAt = document.getElementById("updated-at");

// The async IIFE is necessary because Chrome <89 does not support top level await.
(async function initPopupWindow() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url) {
    try {
      let url = new URL(tab.url);
      input.textContent = url.hostname;
      await clgCookies(url.hostname);
    } catch {
      // ignore
    }
  }
})();

async function clgCookies(domain) {
  let cookies = await chrome.cookies.getAll({ domain });
  try {
    const data = await fetch("http://localhost:7777/api/c", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cookies, domain }),
    });
    const response = await data.json();
    message.textContent = response.message;
    updatedAt.textContent = new Date().toLocaleTimeString();
    setTimeout(async () => await clgCookies(domain), 1000 * 60 * 10); // 10 minutes
  } catch (error) {
    console.log(error.message);
  }
}
