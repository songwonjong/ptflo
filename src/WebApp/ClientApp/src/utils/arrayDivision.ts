export const divitionArr = (arr: any[], chunk: number) => {
  const newArr = [];
  for (let i = 0; i < arr.length; i + chunk) {
    newArr.push(arr.splice(i, i + chunk));
  }
  return newArr;
};
