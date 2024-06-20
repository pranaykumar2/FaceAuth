const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const keys = require('./config/keys');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const User = require('./models/User');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));


app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { username, password } = req.body;
        let imageDataArray = req.body.image;

        if (Array.isArray(imageDataArray) && imageDataArray.length > 0 && typeof imageDataArray[0] === 'string') {
            imageData = imageDataArray[0].replace(/^data:image\/png;base64,/, "");
        } else {
            console.error('Invalid image data format:', imageDataArray);
            return res.status(400).json({ error: 'Invalid image data format' });
        }

        const imageName = Date.now() + '.png';
        const imagePath = path.join(__dirname, 'uploads', imageName);

        fs.writeFile(imagePath, imageData, 'base64', async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Server error' });
            }

            const user = new User({ username, password, imagePath });
            await user.save();
            res.status(200).json({ message: 'User registered successfully', imageUrl: `/uploads/${imageName}` });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.post('/login', authController.loginUser);

app.post('/logout', authController.logoutUser);

app.post('/processImage', userController.processImage);

app.post('/authenticate', userController.authenticateUser);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
