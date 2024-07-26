const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

class FileDatabase {
  constructor(dbPath) {
    this.dbPath = dbPath;
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }
  }

  _getCollectionPath(collection) {
    return path.join(this.dbPath, `${collection}.xdb`);
  }

  async _readCollection(collection) {
    const filePath = this._getCollectionPath(collection);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  }

  async _writeFile(collection, data) {
    const filePath = this._getCollectionPath(collection);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async create(collection, document) {
    const data = await this._readCollection(collection);
    document.id = uuid.v4();
    data.push(document);
    await this._writeFile(collection, data);
    return document;
  }

  async read(collection, query = {}) {
    const data = await this._readCollection(collection);
    return data.filter(item =>
      Object.keys(query).every(key => item[key] === query[key])
    );
  }

  async update(collection, id, updates) {
    const data = await this._readCollection(collection);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    data[index] = { ...data[index], ...updates };
    await this._writeFile(collection, data);
    return data[index];
  }

  async delete(collection, id) {
    const data = await this._readCollection(collection);
    const newData = data.filter(item => item.id !== id);
    await this._writeFile(collection, newData);
  }
}

module.exports = FileDatabase;
