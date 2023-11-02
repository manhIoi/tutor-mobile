export function imageFormat(width, imgWidth, imgHeight) {
  const calculate = width / imgWidth;
  return {
    width: width,
    height: imgHeight * calculate,
  };
}
