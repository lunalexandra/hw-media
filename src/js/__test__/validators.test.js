import { isValidCoords } from "../validators";

test.each([
  [" ", null],
  ["[61.259776, 73.4068736]", "[61.259776, 73.4068736]"],
  ["61.259776, 73.4068736", "[61.259776, 73.4068736]"],
  ["61.259776,73.4068736", "[61.259776, 73.4068736]"],
  ["2125522", null],
  ["", null],
  ["hghjgb,73.4068736", null],
])("checking coords", (number, expected) => {
  expect(isValidCoords(number)).toBe(expected);
});
