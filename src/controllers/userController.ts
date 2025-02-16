import { Request, Response, RequestHandler } from 'express';
import axios from 'axios';

let usersCache: any[] = [];

// Fetch initial users from ReqRes API and store in cache
export const getUsers: RequestHandler = async (req, res) => {
    if (usersCache.length === 0) {
        try {
            const response = await axios.get('https://reqres.in/api/users');
            usersCache = response.data.data; // Store users in memory
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
            return
        }
    }
    res.json(usersCache);
}

export const createUser: RequestHandler = async (req, res) => {
    const { fname, lname, email } = req.body;
    if (!fname || !lname || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const newUser = {
        // If the usersCache array is not empty, it takes the ID of the last user in the array and increments it by 1
        // If the array is empty, it assigns an ID of 1.
        id: usersCache.length ? usersCache[usersCache.length - 1].id + 1 : 1,
        fname,
        lname,
        email
    };

    usersCache.push(newUser);
    res.status(201).json(newUser);
}

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email } = req.body;
    if (!fname || !lname || !email) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const userIndex = usersCache.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    usersCache[userIndex] = { id: parseInt(id), fname, lname, email };
    res.json(usersCache[userIndex]);
}

export const deleteUser: RequestHandler = async (req, res) => {
    const { id } = req.params;
    usersCache = usersCache.filter(user => user.id !== parseInt(id));
    res.status(204).send();
}