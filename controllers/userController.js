const User = require('../models/userModel');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'your-region',
});

exports.uploadToS3 = (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    return s3.upload(params).promise();
};

exports.createUser = (req, res) => {
    const { name, email } = req.body;
    User.create(name, email, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error creating user' });
            return;
        }
        res.status(201).send({ message: 'User created successfully', userId: result.insertId });
    });
};

exports.getUsers = (req, res) => {
    User.getAll((err, users) => {
        if (err) {
            res.status(500).send({ message: 'Error retrieving users' });
            return;
        }
        res.status(200).json(users);
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    User.getById(userId, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error retrieving user' });
            return;
        }
        res.status(200).json(user);
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    User.update(userId, name, email, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error updating user' });
            return;
        }
        res.status(200).send({ message: 'User updated successfully' });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    User.delete(userId, (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error deleting user' });
            return;
        }
        res.status(200).send({ message: 'User deleted successfully' });
    });
};
