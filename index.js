const express = require('express')
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser')
const bCrypt = require('bcrypt')
const { Model } = require('objection')
const database  = require('./database')
Model.knex(database)

const PORT = process.env.PORT || 4000
const saltRounds = 12


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

class Item extends Model {
    static get tableName() {
        return 'items'
    }

    // static relationMappings = {
    //     users: {
    //         relation: Model.ManyToManyRelation,
    //         modelClass: User,
    //         join:{
    //             from: 'item.id',
    //             through: {
    //                 from: 'cart.item_id',
    //                 to: 'cart.user_id'
    //             },
    //             to: users.id
    //         }
    //     }
    // }    
}
class User extends Model {
    static get tableName() {
        return "users"
    }
    static relationMappings = {
        items: {
            relation: Model.ManyToManyRelation,
            modelClass: Item,
            join: {
                from: 'users.id',
                through: {
                    from: 'cart.user_id',
                    to: 'cart.item_id'
                },
                to: 'items.id'
            }
        }
    };
}

class Cart extends Model {
    static get tableName() {
        return 'cart'
    }

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
                from: 'cart.user_id',
                to: 'user.id'
            }
        }
    }

    static relationMappings = {
        item: {
            relation: Model.BelongsToOneRelation,
            modelClass: Item,
            join: {
                from: 'cart.item_id',
                to: 'item.id'
            }
        }
    }
}


app.get('/users', (_,response) => {
    User.query().withGraphFetched('items')
        .then(users => response.json({ users }))
})      


app.post('/users', (request, response) => {
    bCrypt.hash(request.body.password, saltRounds, (error, hashed_password) => {         
        database('users')
            .insert({
                username: request.body.username,
                password_digest: hashed_password
            })
            .returning(['id', 'username', 'password_digest'])
            .then(newUser => response.json({ user: newUser[0] }));
    })
})

app.get('/items', (_,response) => {
    Item.query()
        .then(items => response.json({ items }))
})  

app.post('/items', (request, response) => {
    database('items').insert({
        name: request.body.name
    }).returning(['name']).then(newItem => response.json( {newItem}))
})

app.get('/cart', (_,response) => {
    Cart.query()
        .then(cart => response.json({ cart }))
})

app.post('/cart', (request, response) => {
    database('cart').insert({
        user_id: request.body.user_id,
        item_id: request.body.item_id
    }).returning(['id','user_id','item_id']).then(newCartItem => response.json( {newCartItem}))
})



app.listen(PORT)