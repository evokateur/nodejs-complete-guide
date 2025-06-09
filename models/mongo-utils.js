const { ObjectId } = require('mongodb');

function normalizeIds(value) {
    if (value === null || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(normalizeIds);

    const { _id, ...rest } = value;
    const result = _id !== undefined ? { id: _id.toString() } : {};

    for (const [k, v] of Object.entries(rest)) {
        result[k] = v instanceof ObjectId ? v.toString() : normalizeIds(v);
    }
    return result;
}

function denormalizeIds(value) {
    if (value === null || typeof value !== 'object') return value;
    if (value instanceof ObjectId) return value;
    if (Array.isArray(value)) return value.map(denormalizeIds);

    const { id, ...rest } = value;
    const result = id !== undefined
        ? { _id: new ObjectId(id) }
        : {};

    for (const [k, v] of Object.entries(rest)) {
        result[k] = denormalizeIds(v);
    }
    return result;
}

module.exports = {
    normalizeIds,
    denormalizeIds,
};
