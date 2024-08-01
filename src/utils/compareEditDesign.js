export const getArrayDifferences = (array1, array2) => {
    const differences = [];
  
    const maxLength = Math.max(array1.length, array2.length);
  
    for (let i = 0; i < maxLength; i++) {
        const item1 = array1[i] || {};
        const item2 = array2[i] || {};
  
        const itemDifferences = getDifferences(item1, item2);
        if (Object.keys(itemDifferences).length > 0) {
            differences.push({
                ...itemDifferences
            });
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
    ]
    
    allKeys.forEach(element => {
      
        switch(element){
          case  "color":
              if(data1[element] !== data2[element]){
                differences[element] = true;
              }else {
                differences[element] = false;
              }
              break;
          case  "variation_name":
            if(data1[element] !== data2[element]){
              differences[element] = true;
            }else {
              differences[element] = false;
            }
            break;
          case  "variation_designNo":
            if(data1[element] !== data2[element]){
              differences[element] = true;
            }else {
              differences[element] = false;
            }
            break;     
          case "variation_image":
              let lengthimg = data1[element]?.length;
              let lengthimg2 = data2[element]?.length;
              if(lengthimg !== lengthimg2 && lengthimg && lengthimg2){
                differences[element] = true;
              } else{
                  let image = data1[element];
                  let image2 = data2[element];
                  let flag = false;
                  for(let i=0;i<lengthimg;i++){
                      if(image[i]?._id !== image2[i]?._id){
                          flag = true;
                          break;
                      }
                  }
                  if(flag){
                    differences[element] = true;
                  }else{
                    differences[element] = false;
                  }
                              
              }
              break;
          case "variation_thumbnail":
              let lengthtb = data1[element]?.length;
              let lengthtb2 = data2[element]?.length;
              if(lengthtb !== lengthtb2 && lengthtb && lengthtb2){
                differences[element] = true;
              } else{
                  let thumbnail = data1[element];
                  let thumbnail2 = data2[element];
                  let flag = false;
                  for(let i=0;i<lengthtb2;i++){
                      if(thumbnail[i]?._id !== thumbnail2[i]?._id){
                          flag = true;
                          break;
                      }
                  }
                  if(flag){
                    differences[element] = true;
                  }else {
                    differences[element] = false;
                  }
                              
              }
              break;
          }
    });
    
    return differences;
  };
