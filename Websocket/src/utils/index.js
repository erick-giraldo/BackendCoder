export const getEmptyProperties = ( object ) => {
    var emptyProperties = [];
    for (var key in object) {
      if (object.hasOwnProperty(key) && !object[key]) {
        emptyProperties.push(key);
      }
    }
    return emptyProperties;
  }
