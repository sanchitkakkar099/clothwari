export const getArrayDifferences = (array1, array2) => {
  const differences = [];
  const maxLength = Math.max(array1.length, array2.length);

  for (let i = 0; i < maxLength; i++) {
    const item1 = array1[i] || {};
    const item2 = array2[i] || {};

    const itemDifferences = getDifferences(item1, item2);
    if (Object.keys(itemDifferences).length > 0) {
      differences.push(itemDifferences);
    }
  }

  return differences;
};

const getDifferences = (data1, data2) => {
  const differences = {};
  const allKeys = [
    'color',
    'variation_designNo',
    'variation_name',
    'variation_thumbnail',
    'variation_image'
  ];

  allKeys.forEach(key => {
    if (key === 'variation_image' || key === 'variation_thumbnail') {
      const array1 = data1[key] || [];
      const array2 = data2[key] || [];
      const length1 = array1.length;
      const length2 = array2.length;

      if (length1 !== length2) {
        differences[key] = true;
      } else if (length1 && length2) {
        let flag = false;
        for (let i = 0; i < length1; i++) {
          if ((array1[i]?._id || '') !== (array2[i]?._id || '')) {
            flag = true;
            break;
          }
        }
        differences[key] = flag;
      }
    } else {
      differences[key] = data1[key] !== data2[key];
    }
  });

  return differences;
};
