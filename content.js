chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.message === "clicked_browser_action") {
    const testResults = await extractTestResultsFromPage();
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
  const filename = document.querySelector("h2");
  chrome.runtime.sendMessage({
    message: "download_csv",
    url: csvUrl,
    filename,
  });
}

function createCsvContent(result) {
  return result
    .map((item) => JSON.stringify(item))
    .join("\n")
    .replace(/(^\[)|(\]$)/gm, "");
}

async function extractTestResultsFromPage() {
  const dashboard = document.querySelectorAll(
    "li.mainTableHeaderRow, li.candidateRow.candidateRow"
  );

  const actionsIndex = 7;
  const results = [...dashboard].map((line, i) => {
    return [...line.children].map((item, j) => {
      if (j === actionsIndex) {
        const url =
          i === 0 ? item.innerText.trim() : item.querySelector("a").href;
        return url;
      }
      return item.innerText.trim();
    });
  });

  const details_url = results.map((result_row) => result_row[actionsIndex]);
  const length = details_url.length;
  let index = 1;
  for (const url of details_url) {
    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      console.log(`${index} / ${length}`);
    }
    index++;
  }

  console.log(results);
  return results;
}
