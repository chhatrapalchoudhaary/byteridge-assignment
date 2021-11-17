import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';
import {GrSearch} from 'react-icons/gr'
import {FcGenericSortingAsc,FcGenericSortingDesc} from 'react-icons/fc'
import { Navbar, Nav } from 'react-bootstrap';
import Pagination from '../Pagination'
import "./Audit.css";


class Auditpage extends React.Component {

    constructor(props) {
        super(props);
    this.state={
        usersList:[],
        searchValue:'',
        currentPage:1,
        usersPerPage:10,
        timeFormat:'24',
    }
    
}

    componentDidMount() {
        
        this.props.getUsers();
        
    }
    

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    //Sorting By First Name

    whenAscendingSortButtonClicked = () => {
        const {user,users} = this.props
        const sortedList = users.items.sort((a, b) => {
          const x = a.firstName.toUpperCase()
          const y = b.firstName.toUpperCase()
          return x > y ? 1 : -1
        })
       this.setState({usersList:sortedList})
      }
    
      whenDescendingSortButtonClicked = () => {
        const {user,users} = this.props
        const sortedList = users.items.sort((a, b) => {
          const x = a.firstName.toUpperCase()
          const y = b.firstName.toUpperCase()
          return x < y ? 1 : -1
        })
        this.setState({usersList:sortedList})
      }


      doSearch=()=>{
          const {searchValue}= this.state
          const {user,users} = this.props
          const searchResult = users.items.filter(data=>
            data.firstName.toLowerCase().includes(searchValue.toLowerCase()),
          )
          this.setState({usersList:searchResult})
      }

    // Change page
    paginate = (number) => {
        const page = number
        this.setState({currentPage:page})
    }


    //Change Date Format

    formatDate=(date)=> {
    let dt = new Date(date),
        month = '' + (dt.getMonth() + 1),
        day = '' + dt.getDate(),
        year = dt.getFullYear();
        
    if (month.length < 2){
        month = '0' + month;
    } 
    if (day.length < 2) {
        day = '0' + day;
    }
        
    return [day, month, year].join('/');
    }

    formateTime = (date)=>{
    let dt = new Date(date),
    hour = '' + dt.getHours(),
    minute = '' + dt.getMinutes(),
    seconds = '' + dt.getSeconds();

    if (hour.length < 2){
        hour = '0' + hour;
    }
    if (minute.length<2){
        minute = '0' + minute;
    }
    if (seconds.length<2){
        seconds = '0' + seconds;
    }

    return [hour,minute,seconds].join(':')
    }


    convertTo12Hr = (date) => {
        let dt = new Date(date),
        hour = '' + dt.getHours(),
        minute = '' + dt.getMinutes(),
        seconds = '' + dt.getSeconds();

        let timewithStamp = [hour,minute,seconds].join(':')

        if(hour==='12'){
            hour="00"
            if (minute.length<2){
                minute = '0' + minute;
            }
            if (seconds.length<2){
                seconds = '0' + seconds;
            }
            timewithStamp = [hour,minute,seconds].join(':')
            timewithStamp = timewithStamp+'AM'
        } else{
            
            if (minute.length<2){
                minute = '0' + minute;
            }
            if (seconds.length<2){
                seconds = '0' + seconds;
            }
            if(hour<12){
                hour= hour
                timewithStamp = [hour,minute,seconds].join(':')
                

                if(hour<10){
                    timewithStamp = '0'+timewithStamp+' AM'
                }
                else{
                    timewithStamp = timewithStamp+' AM'
                }
            }
            else{
                if (minute.length<2){
                    minute = '0' + minute;
                }
                if (seconds.length<2){
                    seconds = '0' + seconds;
                }
                hour = (hour - 12) 
                timewithStamp = [hour,minute,seconds].join(':')
                if(hour<10){
                    timewithStamp = '0'+timewithStamp+' PM'
                }
                else{
                    timewithStamp = timewithStamp+'PM'
                }
            }
            
        }
        
        

        return timewithStamp
    }

  

    renderAuditTable=()=>{
        const {users} = this.props
        const {usersList,searchValue,currentPage,usersPerPage,timeFormat} = this.state

        // Get current users
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = users.items.slice(indexOfFirstUser, indexOfLastUser);

        // For applying search functionality 
        const list = usersList.length>0&& searchValue.length!==0?usersList:currentUsers

        return(
            <React.Fragment>
                <div className="filter-group">
                    <div className="input-group">
                        <div className="form-outline">
                            <input type="search" className="form-control" placeholder="Enter First Name" onChange={(e)=>this.setState({searchValue:e.target.value})} />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={this.doSearch}>
                        <GrSearch/>
                        </button>
                    </div>
                    <div className="sorting">
                    <select id = "dropdown" className="mr-3" value={this.state.timeFormat} onChange={(e)=>this.setState({timeFormat:e.target.value})}>
                            <option value="24">24 Hour</option>
                            <option value="12">12 Hour</option>
                        </select>
                        <button type="button" className="button-sort" onClick={this.whenDescendingSortButtonClicked}><FcGenericSortingDesc/></button>
                        <button type="button" className="button-sort"onClick={this.whenAscendingSortButtonClicked} ><FcGenericSortingAsc/></button>
                    </div>
                </div>

            
            
            <ul className="user-screen">
            <li className="auditor-list-item"> 
                <div className="userdetails-group">
                    <div className="user-table-large-container bold">User Id</div>
                    <div className="user-table-container bold">Role</div>
                    <div className="user-table-large-container bold">Registration Date</div>
                    <div className="user-table-container bold">First Name</div>
                    <div className="user-table-container bold">Last Name</div>
                    <div className="user-table-container bold">Action</div>
                    </div>
                </li>
                {list.map((user, index) =>{
                const convertedDate = this.formatDate(user.createdDate)
                const copyofConvertedTime = this.formateTime(user.createdDate)
                let convertedTime = this.formateTime(user.createdDate)
                
                if(timeFormat==='24'){
                    convertedTime = copyofConvertedTime
                }
                if(timeFormat==='12'){
                    convertedTime = this.convertTo12Hr(user.createdDate)
                }
                const timeInFormat = convertedDate+' '+convertedTime

                return(
                    <li key={user.id} className="auditor-list-item">
                        <div className="userdetails-group">
                            <div className="user-table-large-container">{user.id}</div>
                            <div className="user-table-container">{user.role}</div>
                            <div className="user-table-large-container">{timeInFormat}</div>
                            <div className="user-table-container">{user.firstName}</div>
                            <div className="user-table-container">{user.lastName}</div>
                            <div className="user-table-container">
                            {
                            user.deleting ? <em> - Deleting...</em>
                                : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                    : <span > - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                        }
                        </div>
                        </div>
                    </li>
                    )}
                )}
                
            </ul>
  
            <Pagination
                usersPerPage={usersPerPage}
                totalUsers={users.items.length}
                paginate={this.paginate}
            />
            </React.Fragment>
        )
    }

    render() {
        const { user, users } = this.props;
        

        return (
            <div className="border">
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand ></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link ><Link to="/">Home</Link></Nav.Link>
                        <Nav.Link href="#features">Auditor</Nav.Link>
                        <Nav.Link> <Link to="/login">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                <div className="col-md-12 ">

                    <h1>Hi {user.firstName}!</h1>
                    <p>You're logged in with React!!</p>
                    <h3>All login audit :</h3>
                    {users.loading && <em>Loading users...</em>}
                    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                    {users.items &&
                        this.renderAuditTable()
                    }
                    
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };