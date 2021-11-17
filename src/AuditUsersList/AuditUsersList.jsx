import React from "react"

const AuditUsersList = ({list,handleDeleteUser}) => {
   
    const performHandleDeleteUser = (id)=>{
        handleDeleteUser(id)
    }
    
    return (
        <React.Fragment>
        {list.map((user, index) =>
            <li key={user.id} className="auditor-list-item">
                <div className="userdetails-group">
                    <div className="user-table-large-container">{user.id}</div>
                    <div className="user-table-container">{user.role}</div>
                    <div className="user-table-large-container">{user.createdDate}</div>
                    <div className="user-table-container">{user.firstName}</div>
                    <div className="user-table-container">{user.lastName}</div>
                    <div className="user-table-container">
                    {
                    user.deleting ? <em> - Deleting...</em>
                        : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                            : <span > - <a onClick={performHandleDeleteUser(user.id)}>Delete</a></span>
                }
                </div>
                </div>
            </li>
        )}
        </React.Fragment>
    )
}

export default AuditUsersList
