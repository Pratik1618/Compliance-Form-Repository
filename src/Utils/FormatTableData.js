export const FormatHeaderDataV1 = (inputData) => {
  

  // Extract keys and sort them numerically
  const sortedKeys = Object.keys(inputData).sort((a, b) => {
    const numA = parseInt(a.replace("__EMPTY_", ""), 10);
    const numB = parseInt(b.replace("__EMPTY_", ""), 10);
    return numA - numB;
  });

  // Dynamically generate headerRow1
  const headerRow1 = [];
  let lastIndex = -1;

  sortedKeys.forEach((key) => {
    const index = parseInt(key.replace("__EMPTY_", ""), 10);

    // Fill gaps with empty strings if there is a missing index
    while (lastIndex !== -1 && lastIndex + 1 < index) {
      headerRow1.push("");
      lastIndex++;
    }

    headerRow1.push(inputData[key].replace(/\s+/g, " ").trim()); // Remove extra spaces
    lastIndex = index;
  });
  return headerRow1;
  // console.log(headerRow1);
};

export const FormatHeaderDataV2 = (inputData) => {
  // Define the total number of columns (based on given example)
  const totalColumns = 32;

  // Initialize the headerRow2 array with empty strings
  const headerRow2 = new Array(totalColumns).fill("");

  // Extract keys and sort them numerically
  const sortedKeys = Object.keys(inputData).sort((a, b) => {
    const numA = parseInt(a.replace("__EMPTY_", ""), 10);
    const numB = parseInt(b.replace("__EMPTY_", ""), 10);
    return numA - numB;
  });

  // Fill values starting from index 8 (as per example)
  let startIndex = 8;

  sortedKeys.forEach((key, i) => {
    headerRow2[startIndex + i] = inputData[key].trim(); // Trim to remove extra spaces
  });
  return headerRow2;
};
