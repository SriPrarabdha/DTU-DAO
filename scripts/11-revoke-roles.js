import sdk from './1-initialize-sdk.js'

const token = sdk.getToken("0x6EcF7a4be4cF0d3588AF67aa1C28cF46c10F5454")

const revoke = async () => {
    try{
        const allRoles = await token.roles.getAll();
        console.log("👀 Roles that exist right now : " , allRoles);

        await token.roles.setAll({ admin : [] , minter : []})
        console.log("🎉 Roles after revoking ourself : " , await token.roles.getAll());
        console.error("Failed to revoke ourselves from the DAO trasury", error);

    }catch(err){
        console.log("Failed to revoke our role");
    }
}

revoke()