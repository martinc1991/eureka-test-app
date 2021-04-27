const uriToID = function (uri) {
	return uri.slice(uri.lastIndexOf('/') + 1, uri.lastIndexOf('.'));
};

module.exports = {
	uriToID,
};
