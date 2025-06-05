// popup.js

// Grab references to elements
const fetchBtn = document.getElementById("fetchBtn");
const copyBtn = document.getElementById("copyBtn");
const cookieOutput = document.getElementById("cookieOutput");

// When “Fetch Cookies” is clicked:
fetchBtn.addEventListener("click", async () => {
  // 1. Identify the active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url.includes("instagram.com")) {
    alert("Please switch to an Instagram page (https://www.instagram.com/) and try again.");
    return;
  }

  // 2. Collect all cookies under ".instagram.com"
  chrome.cookies.getAll({ domain: ".instagram.com" }, (cookies) => {
    if (!cookies || cookies.length === 0) {
      alert("No Instagram cookies found. Make sure you’re logged in.");
      return;
    }

    // 3. Build a single string: "name=value; name2=value2; …"
    const cookieStr = cookies
      .map(c => `${c.name}=${c.value}`)
      .join("; ");

    // 4. Place it in the textarea
    cookieOutput.value = cookieStr;

    // 5. Enable “Copy” button
    copyBtn.disabled = false;
  });
});

// When “Copy to Clipboard” is clicked:
copyBtn.addEventListener("click", () => {
  const text = cookieOutput.value;
  if (!text) return;

  // Use the Clipboard API
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
