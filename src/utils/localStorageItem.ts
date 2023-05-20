const getFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  if (item && item !== "undefined") return item;
  return undefined;
};

export default getFromLocalStorage;
