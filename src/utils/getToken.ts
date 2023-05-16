const getCookie = (key: string) => {
  var array = document.cookie.split(";");
  for (const item of array) {
    if (item.startsWith(`${key}=`)) {
      return item.substring(key.length + 1);
    }
    return undefined;
  }
};

export default getCookie;
