function normalizeId(doc) {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
}

function normalizeMany(docs) {
    if (!docs || docs.length === 0) return [];
    return docs.map(normalizeId);
}

module.exports = {
    normalizeId,
    normalizeMany
};
