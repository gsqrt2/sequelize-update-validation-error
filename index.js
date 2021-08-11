const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuid } = require('uuid');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
});


  const Connection = sequelize.define('Connection', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user1id: {
        type: DataTypes.UUID,
        required: true,
    },
    user2id: {
        type: DataTypes.UUID,
        required: true,
    },
    approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
{
    timestamps: false,
    validate: {
        cannotConnectToSelf() {
            // console.log(this)
            if(this.user1id === this.user2id)
                throw new Error('Cannot connect to self.');
        },
    }
})

sequelize.sync({ force: true }).then( async () => {
    try{
        // Test validator
        // const constuuid = uuid()
        // await Connection.create({
        //     user1id: constuuid,
        //     user2id: constuuid,
        // })
        
        await Connection.create({
            user1id: uuid(),
            user2id: uuid(),
        })
    
        await Connection.create({
            user1id: uuid(),
            user2id: uuid(),
        })
    
        // Try to update connections
        await Connection.update({
            approved: true
        },{
            where: {
                approved: false
            }
        })
    
    }catch(err){
        console.error(err)
    }
})