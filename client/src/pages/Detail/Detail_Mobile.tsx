import React, { useEffect, useState, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DispatchType, RootState } from "../../redux/configStore";
import {
  getBookingDetailApi,
  postBookingApi,
} from "../../redux/reducers/bookingReducer";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { history } from "../../index";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { UserContext } from "../User/UserContext";

export default function Detail() {
  const { userInfo }: any = useContext(UserContext);
  const { arrBookingId } = useSelector(
    (state: RootState) => state.bookingReducer
  );

  const dispatch: DispatchType = useDispatch();

  const params: any = useParams();

  const [clickedImg, setClickedImg] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const responsive_detail = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
  useEffect(() => {
    const action = getBookingDetailApi(params.id);
    dispatch(action);
  }, [params.id]);



  //Set image when click show full screen------------------------------//
  const handleClick = (item: any, index: any) => {
    setCurrentIndex(index);
    setClickedImg(item);
  };
  const handelRotationRight = () => {
    const totalLength = arrBookingId?.photos.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = arrBookingId?.photos[0];
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = arrBookingId?.photos.filter((item: any) => {
      return arrBookingId?.photos.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0];
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };
  const handelRotationLeft = () => {
    const totalLength = arrBookingId?.photos.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = arrBookingId?.photos[totalLength - 1];
      setClickedImg(newUrl);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = arrBookingId?.photos.filter((item: any) => {
      return arrBookingId?.photos.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0];
    setClickedImg(newItem);
    setCurrentIndex(newIndex);
  };
  const handleClickModal = (e: any) => {
    if (e.target.classList.contains("dismiss")) {
      setClickedImg(null);
    }
  };

  // hide dropdown on ESC press
  const hideOnEscape = (event: any) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
  }, []);


  // Click outside to close calendar----------------------------------------------------------------
  const myRef = useRef<HTMLInputElement>(null);
  const handleClickOutside = (event: any) => {
    if (!myRef.current?.contains(event.target)) {
      setOpen(false)
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });


  // Process data to dispatch
  const checkIn: any = arrBookingId?.checkIn;
  const checkOut: any = arrBookingId?.checkOut;
  const price: any = arrBookingId?.price;
  const handleChangeDate = (rangesByKey: RangeKeyDict) => {
    const changeDate: any = rangesByKey;
    setRange([changeDate.selection]);
  };
  const dateDiff = (date1: any, date2: any) => {
    const dt1 = new Date(date1);
    const dt2 = new Date(date2);
    return Math.floor(
      (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
        Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
    );
  };
  const totalPrice =
    price *
    dateDiff(
      format(range[0].startDate, "yyyy-MM-dd"),
      format(range[0].endDate, "yyyy-MM-dd")
    ) +
    10;
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      dateIn: { value: any };
      dateOut: { value: any };
      guest: { value: number };
    };
    const dateIn = target.dateIn.value;
    const dateOut = target.dateOut.value;
    const guest = target.guest.value;
    if (!userInfo) {
      toast.error("Please login your account !!!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        onClose: () => history.push("/user/login"),
      });
    } else {
      const action = postBookingApi(
        arrBookingId?._id,
        userInfo?._id,
        name,
        phone,
        dateIn,
        dateOut,
        guest,
        totalPrice
      );
      dispatch(action);
    }
  };
  return (
    <div className="detail-page-mobile">
      <div className="container">
        <h3 className="py-3 text-center border-bottom border-2">
          🔔{arrBookingId?.title}
        </h3>
        <div className="title pt-2">
          <div className="info">
            <ul>
              <li className="py-1">
                🏨<span>Super host ⭐5,0</span>
              </li>
              <li>📌{arrBookingId?.address}</li>
            </ul>
          </div>
          <div className="share">
            <ul>
              <li>
                ↪️<span>Share</span>
              </li>
              <li>
                ❤️ <span>Save</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="image py-2">
          <div className="d-none pic">
            {arrBookingId?.photos.map((pic: any, index: number) => {
              return (
                <img
                  src={pic}
                  className={`w-100 h-100 p-1 item-${index}`}
                  alt=""
                  key={index}
                  onClick={() => handleClick(pic, index)}
                  style={{ cursor: "pointer" }}
                />
              );
            })}
          </div>
          <div className="d-block d-md-none">
            <Carousel showDots={true} responsive={responsive_detail}>
              {arrBookingId ? (
                arrBookingId.photos.map((pic: any, index: number) => {
                  return (
                    <img
                      src={pic}
                      className="w-100 h-100 rounded"
                      alt=""
                      key={index}
                    />
                  );
                })
              ) : (
                <div />
              )}
            </Carousel>
          </div>
        </div>
        <div className="d-none d-md-flex">
          {clickedImg && (
            <div className="overlay dismiss" onClick={handleClickModal}>
              <img src={clickedImg} alt="bigger pic" />
              <span className="close">
                <i
                  className="dismiss bi bi-x-square-fill"
                  onClick={handleClickModal}
                ></i>
              </span>
              <div onClick={handelRotationLeft} className="overlay-arrows_left">
                <i
                  className="bi bi-arrow-left-circle-fill"
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
              <div
                onClick={handelRotationRight}
                className="overlay-arrows_right"
              >
                <i
                  className="bi bi-arrow-right-circle-fill"
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            </div>
          )}
        </div>
        <div className="description">
          <div className="row">
            <div className="content col-12">
              <div className="row">
                <div className="title-left">
                  <h3>🔔Entire apartment - Apartments for Rent</h3>
                </div>
              </div>
              <div className="service col-12 border-top border-bottom py-3">
                <div className="row">
                  <div className="item d-flex pb-2">
                    <div className="col-1 fs-2">🏨</div>
                    <div className="col-11 d-flex flex-column justify-content-center">
                      <h4 className="m-0">The Whole House</h4>
                      <p>Luxury Apartments</p>
                    </div>
                  </div>
                  <div className="item d-flex pb-2">
                    <div className="col-1 fs-2">🧼️</div>
                    <div className="col-11 d-flex flex-column justify-content-center">
                      <h4 className="m-0">Enhanced Clean</h4>
                      <p>The five-step enhanced cleaning process for DnD</p>
                    </div>
                  </div>
                  <div className="item d-flex pb-2">
                    <div className="col-1 fs-2">💯</div>
                    <div className="col-11 d-flex flex-column justify-content-center">
                      <h4 className="m-0">Super host</h4>
                      <p>{arrBookingId?.description}</p>
                    </div>
                  </div>
                  <div className="item d-flex pb-2">
                    <div className="col-1 fs-2">📅</div>
                    <div className="col-11 d-flex flex-column justify-content-center">
                      <h4 className="m-0">Free for 48 hours</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="facility py-3 border-top w-100">
                <h4>What this place offers</h4>
                <div className="show-more d-flex flex-row flex-wrap pt-3">
                  {arrBookingId?.perks.map((perk: any, index: number) => {
                    return (
                      <div
                        className="col-3 border p-3 bg-white rounded"
                        key={index}
                      >
                        {perk === "wifi" ? (
                          <label>
                            <i className="text-primary  bi bi-wifi"></i>{" "}
                            <span>Wifi</span>
                          </label>
                        ) : (
                          ""
                        )}
                        {perk === "tv" ? (
                          <label>
                            📺<span>TV</span>
                          </label>
                        ) : (
                          ""
                        )}
                        {perk === "pet" ? (
                          <label>
                            🐶 <span>Pets</span>
                          </label>
                        ) : (
                          ""
                        )}
                        {perk === "park" ? (
                          <label>
                            🚘 <span>Park</span>
                          </label>
                        ) : (
                          ""
                        )}
                        {perk === "entrance" ? (
                          <label>
                            🚪 <span>Entry</span>
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="schedule">
                {checkIn >= 12 ? (
                  <p>
                    <span className="fw-bold">➡️Check In:</span>{" "}
                    {arrBookingId?.checkIn}:00 PM
                  </p>
                ) : (
                  <p>
                    <span className="fw-bold">➡️Check In</span>{" "}
                    {arrBookingId?.checkIn}:00 AM
                  </p>
                )}
                {checkOut >= 12 ? (
                  <p>
                    <span className="fw-bold">⬅️Check Out:</span>{" "}
                    {arrBookingId?.checkOut}:00 PM
                  </p>
                ) : (
                  <p>
                    <span className="fw-bold">⬅️Check Out:</span>{" "}
                    {arrBookingId?.checkOut}:00 AM
                  </p>
                )}
                <p>
                  <span className="fw-bold">#️⃣Max guest:</span>{" "}
                  {arrBookingId?.maxGuest} guest
                </p>
              </div>
            </div>
            <div className="payment col-12 p-3 d-flex justify-content-center">
              <form onSubmit={handleSubmit}>
                <div className="check p-4 bg-light">
                  <div className="cost">
                    <p>
                      {" "}
                      <span className="fw-bold">💲{arrBookingId?.price}</span>
                      /night
                    </p>
                  </div>
                  <div className="row">
                    <div className="calendar p-2 text-center ">
                      <div className="check">
                        <div className="check-in w-50 me-3">
                          <p>
                            🗓 Check In
                          </p>
                          <input
                            id="dateIn"
                            name="dateIn"
                            value={format(range[0].startDate, "yyyy-MM-dd")}
                            readOnly
                            className="date-in text-center"
                            onClick={() => setOpen((open) => !open)}
                          />
                        </div>
                        <div className="check-out  w-50">
                          <p>
                            🗓 Check Out
                          </p>
                          <input
                            id="dateOut"
                            name="dateOut"
                            value={format(range[0].endDate, "yyyy-MM-dd")}
                            readOnly
                            className="date-out text-center"
                            onClick={() => setOpen((open) => !open)}
                          />
                        </div>
                      </div>
                      <div ref={myRef}>
                        {open && (
                          <DateRangePicker
                            onChange={handleChangeDate}
                            editableDateInputs={true}
                            moveRangeOnFirstSelection={false}
                            ranges={range}
                            months={1}
                            direction="horizontal"
                            className="calendarElement"
                          />
                        )}
                      </div>
                    </div>
                    <div className="add-guest w-100 mt-2 p-2">
                      <p>Guest: </p>
                      <input
                        className="w-20"
                        type="number"
                        id="guest"
                        name="guest"
                      />
                    </div>
                    <div className="add-guest w-100 mt-2 p-2">
                      <p>Name: </p>
                      <input
                        className="w-20"
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="add-guest w-100 mt-2 p-2">
                      <p>Phone: </p>
                      <input
                        className="w-20"
                        type="text"
                        id="phone"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="button my-3">
                      <button className="btn border" type="submit">
                        Reserve
                      </button>
                      <ToastContainer
                        position="top-center"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                      />
                    </div>
                    <div className="notification text-center">
                      <p>You won't be charged yet</p>
                    </div>
                    <div className="check-payment border-bottom">
                      <div className="cost-amount d-flex justify-content-between">
                        <div className="cost-date">
                          <p>
                            💲{price} x{" "}
                            {dateDiff(
                              format(range[0].startDate, "yyyy-MM-dd"),
                              format(range[0].endDate, "yyyy-MM-dd")
                            )}{" "}
                            night
                          </p>
                        </div>
                        <div className="bill">
                          <p>
                            💲
                            {price *
                              dateDiff(
                                format(range[0].startDate, "yyyy-MM-dd"),
                                format(range[0].endDate, "yyyy-MM-dd")
                              )}
                          </p>
                        </div>
                      </div>
                      <div className="service-cost d-flex justify-content-between">
                        <div className="service">
                          <p>Cleaning fee</p>
                        </div>
                        <div className="cost">💲10</div>
                      </div>
                    </div>
                    <div className="total d-flex justify-content-between py-3">
                      <div className="detail">
                        <p>Total before taxes</p>
                      </div>
                      <div className="in-total">
                        💲
                        {price *
                          dateDiff(
                            format(range[0].startDate, "yyyy-MM-dd"),
                            format(range[0].endDate, "yyyy-MM-dd")
                          ) +
                          10}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
