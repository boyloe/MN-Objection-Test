
exports.seed = async function(knex) {
  await knex('cart').del()
  await knex('users').del()
  await knex('items').del()


  const melissa =  await knex('users').insert(
    {
      username: 'Melissa',
      password_digest: '12345'
    }).returning("id").then(records => records[0])
  const shelly =  await knex('users').insert(
    {
      username: 'Shelly',
      password_digest: '45555'
    }).returning("id").then(records => records[0])
  
  const bicycle = await knex('items').insert(
    {
      name: 'Bike'
    }).returning("id").then(records => records[0])
  const skittles = await knex('items').insert(
    {
      name: 'Skittles'
    }).returning("id").then(records => records[0])
  const handcuffs = await knex('items').insert(
    {
      name: 'Handcuffs'
    }).returning("id").then(records => records[0])

  await knex('cart').insert([
    {
      user_id: bryan,
      item_id: bicycle
    },
    
    {
      user_id: melissa,
      item_id: skittles
    },
    
    {
      user_id: melissa,
      item_id: handcuffs
    },
    {
      user_id: shelly,
      item_id: handcuffs
    },
    {
      user_id: shelly,
      item_id: bicycle
    },    
  ])
return true
};
