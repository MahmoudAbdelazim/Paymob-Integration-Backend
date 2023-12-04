exports.reduce = async (base64String) => {
  const sharp = require("sharp");

  // Set the maximum file size in bytes
  const MAX_FILE_SIZE = 1024 * 512; // 0.5 MB
  // Decode the Base64 image string
  const buffer = Buffer.from(base64String, "base64");
  // Reduce the quality of the image until its size is below the maximum file size
  let reducedBuffer = buffer;
  reducedBuffer = await sharp(reducedBuffer)
    .resize({ width: 1024 })
    .toBuffer();
  console.log("heere " + reducedBuffer.length);
  // Convert the reduced buffer back to a Base64 string
  const reducedBase64String = reducedBuffer.toString("base64");

  return reducedBase64String;
};
