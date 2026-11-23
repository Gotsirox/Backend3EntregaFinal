// Doble de prueba usado por los tests funcionales (patrón de la clase 6)
const clone = (value) => structuredClone(value);

export class InMemoryService {
    constructor(records = []) {
        this.records = new Map(records.map((record) => [record._id, clone(record)]));
        this.nextId = records.length + 1;
    }

    async getAll() { return [...this.records.values()].map(clone); }

    async getBy(criteria) { return clone(this.records.get(criteria._id) ?? null); }

    async getUserById(id) { return this.getBy({ _id: id }); }

    async create(record) {
        const saved = { _id: String(this.nextId++), ...clone(record) };
        this.records.set(saved._id, saved);
        return clone(saved);
    }

    async update(id, changes) {
        const record = this.records.get(id);
        if (!record) return null;
        Object.assign(record, clone(changes));
        return clone(record);
    }

    async delete(id) {
        const record = this.records.get(id) ?? null;
        this.records.delete(id);
        return clone(record);
    }
}

export default InMemoryService;
