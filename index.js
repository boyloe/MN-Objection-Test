const express = require('express')
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser')
const bCrypt = require('bcrypt')
const { Model } = require('objection')

const PORT = process.env.PORT || 4000

const database  = require('./database')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

class User extends Model {
    static tableName = "users";

    static relationMappings = {
        items: {
            relation: Model.ManyToManyRelation,
            modelClass: Item,
            join: {
                from: 'user.id',
                through: {
                    from: 'cart.user_id',
                    to: 'cart.item_id'
                },
                to: 'item.id'
            }
        }
    };
}


app.get('/users', (_,response) => {
    database('users').select()
        .then(users => response.json({ users: users }))
})      


app.post('/users', (request, response) => {
    bCrypt.hash(request.body.password, 12, (error, hashed_password) => {         
        database('users')
            .insert({
                username: request.body.username,
                password_digest: hashed_password
            })
            .returning(['id', 'username', 'password_digest'])
            .then(newUser => response.json({ user: newUser[0] }));
    })
})



app.listen(PORT)