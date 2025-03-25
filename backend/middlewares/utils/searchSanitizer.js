// Function to escape regex special characters
const escapeRegex = (query) => {
	return query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const searchSanitizer = (search) => {
	if (typeof search !== "string") return null;
	let searchQuery = search.trim();

	// Limit the length to prevent abuse and empty searches
	if (searchQuery.length === 0 || searchQuery.length > 100) {
		return null;
	}
	return (sanitizedSearch = escapeRegex(searchQuery));
};

module.exports = searchSanitizer;
