import { Types } from 'mongoose';

export const serializeData = (data: Record<string, any>) => {
  const transformedData = Object.keys(data).reduce((acc, key) => {
    let strVal;

    if (data[key] instanceof Types.ObjectId) {
      strVal = data[key].toString(); 
    }
  
    else if (data[key] instanceof Date) {
      strVal = data[key].toISOString();
    }
  
    else if (Buffer.isBuffer(data[key])) {
      strVal = data[key].toString('base64');
    }
  
    else {
      strVal = data[key];
    }

    data[key] = strVal;
    return acc;
  }, {});

  return transformedData;
};
