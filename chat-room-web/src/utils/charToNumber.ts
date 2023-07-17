export function charToNumber(char: string): number {
  if (typeof char === "string" && char.length === 1) {
    const charCode = char.charCodeAt(0);
    if (charCode >= 48 && charCode <= 57) {
      // char is a number
      return charCode - 48 + 7;
    } else if (charCode >= 97 && charCode <= 122) {
      // char is a lowercase letter
      return charCode - 97 + 1;
    } else if (charCode >= 65 && charCode <= 90) {
      // char is an uppercase letter
      return charCode - 65 + 1;
    }
  }

  // char is not valid, return -1 or handle the case as needed
  return -1;
}
