const capitalizeWords = (sentence) => {
  return sentence
    ?.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export {capitalizeWords}