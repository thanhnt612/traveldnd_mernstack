import { useContext, useEffect, useState } from 'react'
import { getOwnerRoomApi } from '../../redux/reducers/bookingReducer'
import { useDispatch, useSelector } from 'react-redux';
import { DispatchType, RootState } from '../../redux/configStore';
import { NavLink } from 'react-router-dom';
import { LoadingPage } from '../../Components/Icon';
import { UserContext } from '../User/UserContext';

export default function ListRent() {
    const dispatch: DispatchType = useDispatch();
    const { userInfo }: any = useContext(UserContext);
    const { arrOwnerRoom } = useSelector((state: RootState) => state.bookingReducer);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        dispatch(getOwnerRoomApi(userInfo?._id))
        if (arrOwnerRoom.length === 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
            }, 2000)
        } else {
            setLoading(false);
        }
    }, [arrOwnerRoom.length, userInfo?._id])
    const renderListRoom = () => {
        if (!userInfo) {
            return (
                <div className='text-center py-3'>
                    <h4>
                        Please login or sign up to make a room for rent
                    </h4>
                    <div className='py-2'>
                        <NavLink className="text-decoration-none p-2 bg-danger text-white rounded me-2" to="/user/login">Log In</NavLink>
                        <NavLink className="text-decoration-none p-2 bg-danger text-white rounded" to="/user/register">Sign Up</NavLink>
                    </div>
                </div>
            )
        } else if (arrOwnerRoom.length === 0) {
            return (
                <div className='text-center py-3'>
                    <h4>
                        You don't have any room for rent yet!!!  <br />
                        Click below to add new place
                    </h4>
                    <div className='py-2'>
                        <NavLink className="text-decoration-none p-2 btn btn-danger text-white rounded me-2"
                            to="/place/new">
                            Add New Place
                        </NavLink>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='py-3'>
                    {arrOwnerRoom.map((item: any, index: number) => {
                        return <div className="main my-3 p-3 d-flex flex-row flex-wrap rounded border border-2 border-success 
                        border-opacity-25" key={index}>
                            <div className="col-12 col-md-3 position-relative">
                                <img src={item.photos[0]} alt="" className='object-fit-cover rounded w-100 h-100' />
                                <NavLink className="d-block d-md-none m-2 position-absolute text-light btn btn-warning rounded-circle p-2 border-3 border-warning border pt-2 top-0 end-0"
                                    to={`/place/update-room/${item._id}`}>
                                    ✏️
                                </NavLink>
                            </div>
                            <div className="col-12 col-md-9 detail p-3 position-relative">
                                <p className='text-truncate fw-bold mb-1'>
                                    {item.available
                                        ?
                                        <span className='text-success'>Availability</span>
                                        :
                                        <>
                                            <a className="text-danger text-decoration-none" data-bs-toggle="collapse" href={`#collapse${index}`}>
                                                Fully - Booked By <i className="bi bi-caret-down-fill"></i>
                                            </a>
                                            <div className="collapse " id={`collapse${index}`}>
                                                <button className='btn btn-outline-danger fw-bold'>
                                                    {item.bookingId.name} - {item.bookingId.phone}
                                                </button>
                                            </div>
                                        </>
                                    }
                                </p>
                                <h5 className='fw-bold text-truncate'>
                                    {item.address}
                                </h5>
                                <p>
                                    {item.title}
                                </p>
                                <p className='text-truncate'>
                                    {item.description}
                                </p>
                                <NavLink className="d-none d-md-block position-absolute text-light btn btn-outline-warning rounded-circle p-2 border-3 border-warning border pt-2 top-0 end-0" to={`/place/update-room/${item._id}`}>
                                    ✏️
                                </NavLink>
                                <NavLink to={`/detail/${item._id}`} className="btn btn-danger">
                                    <span>
                                        👉View Details
                                    </span>
                                </NavLink>
                            </div>
                        </div>
                    })}
                </div>
            )
        }
    }
    return (
        <div className='container list-rent bg-white p-4 rounded'>
            <NavLink to="/" className='text-decoration-none'>
                <span className='p-2 rounded-pill text-white bg-danger'>
                    <i className="bi bi-sign-turn-left-fill"></i> Home
                </span>
            </NavLink>
            <div className='title text-start text-md-center py-4 p-md-4'>
                <span className='p-2 rounded-pill text-white bg-danger'>
                    <i className="bi bi-house-add"></i> Your apartment for rent
                </span>
            </div>
            {loading ? (
                <LoadingPage className={`loading-spinner dark bg-transparent`} />
            ) : (
                <>
                    {renderListRoom()}
                </>
            )}
        </div>
    )
}