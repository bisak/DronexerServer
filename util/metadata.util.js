module.exports = () => {
	return {
		filterMetadataObject(metadata){
			let outputMetadata = {}
			console.log(metadata)
			if (metadata.hasOwnProperty('tags')) {
				if (metadata.tags.hasOwnProperty('GPSLatitude')) outputMetadata.lat = metadata.tags.GPSLatitude
				if (metadata.tags.hasOwnProperty('GPSLongitude')) outputMetadata.lng = metadata.tags.GPSLongitude
				if (metadata.tags.hasOwnProperty('GPSAltitude')) outputMetadata.alt = metadata.tags.GPSAltitude
				if (metadata.tags.hasOwnProperty('Make')) outputMetadata.makeModel = metadata.tags.Make
				if (metadata.tags.hasOwnProperty('Model')) outputMetadata.makeModel = outputMetadata.makeModel + ' ' + metadata.tags.Model
				if (metadata.tags.hasOwnProperty('DateTimeOriginal') || metadata.tags.hasOwnProperty('CreateDate')) outputMetadata.dateTaken = metadata.tags.DateTimeOriginal || metadata.tags.CreateDate
			}
			return outputMetadata

		}
	}
}