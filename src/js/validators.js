export function isValidCoords(input) {
  input = input.toString().trim();

  input = input.replace(/[\[\]]/g, "");

  let parts = input.split(",").map((part) => part.trim());

  if (parts.length !== 2) {
    return null;
  }

  let latitude = parseFloat(parts[0]);
  let longitude = parseFloat(parts[1]);

  if (isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  return `[${latitude}, ${longitude}]`;
}
