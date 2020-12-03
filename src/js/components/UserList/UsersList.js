import React, {useEffect, useState} from 'react'

function UsersList({users}) {
    return (
        <div className="temp_users_list">
            {/*{console.log(users)}*/}
            {users.map(({name, id, email}) => (
                    <div className='user_box' key={id}>
                        <p>{name}</p>
                    </div>
                )
            )}
        </div>
    );
}

export default UsersList;