const fs = require('fs');
const path = require('path');
const express = require('express');
const gcloud = require('google-cloud');
const imageSize = require('image-size');
const multipart = require('connect-multiparty');

// const vision = gcloud.vision({
// 	projectId: 'cloud-vision-test',
// 	keyFilename: './key/Cloud vision test-62238edbe51f.json',
// });

const vision = gcloud.vision();

const app = express();
const uploadDir = path.join(__dirname, 'images');

app.use(express.static(path.join(__dirname, 'frontend', 'static')))
app.use(multipart({ uploadDir }));

function cleanupFiles(files) {
	for (var name in files) {
		const filePath = files[name].path;
		fs.unlink(filePath, function(err) {
			if (err) {
				console.log(`Error: couldn't unlink ${filePath}`);
			}
		});
	}
}

app.post('/faces', (req, res) => {
	const files = req.files;
	const image = files.image;

	if (!image) {
		res.status(400).end();
		cleanupFiles(files);
		return;
	}

	const imagePath = image.path;

	imageSize(imagePath, function(err, dimensions) {
		if (err) {
			console.log(`Error: ${err}`);
			res.status(400).end();
			cleanupFiles(files);
			return;
		}

		vision
			.detectFaces(imagePath)
			.then(function(data) {
				const faces = data[0];
				return {
					faces,
					dimensions,
				};
			})
			.then(function(data) {
				res.status(200).json(data);
				cleanupFiles(files);
			})
			.catch(function(err) {
				res.status(400).end(err);
				cleanupFiles(files);
			})
	});
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}