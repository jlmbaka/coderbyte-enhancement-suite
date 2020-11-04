chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    const testResults = extractTestResultsFromPage();
    const csvContent = createCsvContent(testResults);
    const csvUrl = configureCsvForDownload(csvContent);
    downloadCsv(csvUrl);
  }
});

function configureCsvForDownload(csvContent) {
  const csvBlob = new Blob([csvContent], {
    type: "text/csv",
  });
  const csvUrl = URL.createObjectURL(csvBlob);
  return csvUrl;
}

function downloadCsv(csvUrl) {
  chrome.runtime.sendMessage({
    message: "download_csv",
    url: csvUrl,
  });
}

function createCsvContent(result) {
  return result
    .map((item) => JSON.stringify(item))
    .join("\n")
    .replace(/(^\[)|(\]$)/gm, "");
}

function extractTestResultsFromPage() {
  const dashboard = document.querySelectorAll(
    "li.mainTableHeaderRow, li.candidateRow.candidateRow"
  );
  const result = [...dashboard].map((line) => {
    return [...line.children].map((item) => item.innerText.trim());
  });
  console.log(result);
  return result;
}
