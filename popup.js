// popup.js

const cookieOutput = document.getElementById("cookieOutput");
const copyBtn = document.getElementById("copyBtn");
const statusDiv = document.getElementById("status");

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Find the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // 2. Check if URL includes "instagram.com"
  if (!tab || !tab.url.includes("instagram.com")) {
    statusDiv.textContent = "⚠️ Please open an Instagram tab first.";
    cookieOutput.value = "";
    return;
  }

  statusDiv.textContent = "✅ Instagram tab detected. Fetching cookies…";

  // 3. Get all cookies under ".instagram.com"
  chrome.cookies.getAll({ domain: ".instagram.com" }, (cookies) => {
    if (!cookies || cookies.length === 0) {
      statusDiv.textContent = "❌ No cookies found. Are you logged in?";
      cookieOutput.value = "";
      return;
    }

    // 4. Build single string: "name=value; name2=value2; …"
    const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join("; ");

    // 5. Populate the textarea
    cookieOutput.value = cookieStr;
    statusDiv.textContent = `👍 ${cookies.length} cookies fetched.`;

    // 6. Enable “Copy to Clipboard”
    copyBtn.disabled = false;
  });
});

// When “Copy to Clipboard” is clicked:
copyBtn.addEventListener("click", () => {
  const text = cookieOutput.value;
  if (!text) return;

  navigator.clipboard.writeText(text)
    .then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy to Clipboard";
      }, 1500);
    })
    .catch(err => {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard.");
    });
});
