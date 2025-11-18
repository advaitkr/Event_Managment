import { create, findOne, findById } from '../models/User';


export async function create(payload) { return create(payload); }
export async function findByEmail(email) { return findOne({ email }); }
export async function findById(id) { return findById(id); }