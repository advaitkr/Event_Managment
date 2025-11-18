import { find, findById, create, findByIdAndDelete } from '../models/Event';


export async function findAll(filter = {}) {
return find(filter).populate('createdBy', 'name email');
}


export async function findById(id) { return findById(id).populate('createdBy', 'name email'); }


export async function create(data) { return create(data); }


export async function update(id, data) {
const event = await findById(id);
Object.assign(event, data);
return event.save();
}


export async function remove(id) { return findByIdAndDelete(id); }