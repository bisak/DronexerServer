const exifParser = require('exif-parser')

function filterMetadata(metadata) {
  let outputMetadata = {}
  if (metadata.hasOwnProperty('tags')) {
    outputMetadata.lat = metadata.tags.GPSLatitude
    outputMetadata.lng = metadata.tags.GPSLongitude
    outputMetadata.alt = metadata.tags.GPSAltitude
    outputMetadata.make = metadata.tags.Make
    outputMetadata.model = metadata.tags.Model
    outputMetadata.dateTaken = metadata.tags.DateTimeOriginal || metadata.tags.CreateDate
  }
  return outputMetadata
}

module.exports = () => {
  return {
    extractMetadata(picture){
      try {
        let metadata = exifParser.create(picture.buffer).parse()
        return filterMetadata(metadata)
      } catch (error) {
        console.error(error);
      }
    },
    isGenuineDronePicture(metadata){ /*This will improve with time*/
      let genuine = false;
      if (metadata && metadata.hasOwnProperty('alt') &&
        metadata.hasOwnProperty('lng') &&
        metadata.hasOwnProperty('lat') &&
        metadata.hasOwnProperty('make') &&
        metadata.make === 'DJI' &&
        metadata.hasOwnProperty('dateTaken')) {
        genuine = true;
      }
      return genuine
    }
  }
}