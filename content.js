chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "clicked_browser_action") {
    // parse the parse in order to extract the data
    const dashboard = document.querySelectorAll(
      "li.mainTableHeaderRow, li.candidateRow.candidateRow"
    );
    const result = [...dashboard].map((line) => {
      return [...line.children].map((item) => item.innerText.trim());
    });
    console.log(result);
    // create CSV
    const csvContent = result
      .map((item) => JSON.stringify(item))
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");
    // configure CSV for download
    const csvBlob = new Blob([csvContent], {
      type: "text/csv",
    });
    const csvUrl = URL.createObjectURL(csvBlob);
    // download
    chrome.runtime.sendMessage({
      message: "download_csv",
      url: csvUrl,
    });
    // chrome.downloads.download({ url: csvUrl });
  }
});
