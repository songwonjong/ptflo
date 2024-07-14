// export function toComma(value: number | string): string {
//   return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
// }

type Value = number | string;

export function toComma(value: Value): string {
  let new_value: Value;
  {
    typeof value === "string"
      ? (new_value = value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","))
      : (new_value = value
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
  }
  return new_value;
}

export function deComma(value: string): string {
  let new_value = value.replace(/,/g, "");
  return new_value;
}

