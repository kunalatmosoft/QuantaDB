const { v4: uuidv4 } = require('uuid');

class InMemoryDatabase {
  constructor() {
    this.data = {};
  }

  create(collection, document) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newDocument = { ...document, id: uuidv4() };
    this.data[collection].push(newDocument);
    return newDocument;
  }

  read(collection, query) {
    return this.data[collection]?.filter((doc) => {
      return Object.keys(query).every((key) => doc[key] === query[key]);
    }) || [];
  }

  update(collection, id, newData) {
    const collectionData = this.data[collection];
    if (collectionData) {
      const index = collectionData.findIndex((doc) => doc.id === id);
      if (index !== -1) {
        collectionData[index] = { ...collectionData[index], ...newData };
        return collectionData[index];
      }
    }
    return null;
  }

  delete(collection, id) {
    const collectionData = this.data[collection];
    if (collectionData) {
      const index = collectionData.findIndex((doc) => doc.id === id);
      if (index !== -1) {
        return collectionData.splice(index, 1)[0];
      }
    }
    return null;
  }
}

module.exports = InMemoryDatabase;
