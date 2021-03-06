/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUser, getUserDetailId, updatePhoto, updateUser } from '../redux/actions/users';

import styles from '../assets/styles/Chat.module.css';
import burger from '../assets/images/burger.svg';
import gear from '../assets/images/setting.svg';
import call from '../assets/images/call.svg';
import contact from '../assets/images/contact.svg';
import faq from '../assets/images/faq.svg';
import invite from '../assets/images/invite.svg';
import save from '../assets/images/save.svg';
import search from '../assets/images/search.svg';
import plus from '../assets/images/plus.svg';
import profileMenu from '../assets/images/menuProfile.svg';
import emot from '../assets/images/emot.svg';
import postimage from '../assets/images/postimage.svg';
import backIcon from '../assets/images/back.svg';
import editIcon from '../assets/images/edit.photo.profile.svg';

export default function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const detailUser = useSelector((state) => state.detailUser.data);
  const allUser = useSelector((state) => state.getAlluser.data);
  // console.log(detailUser.email);

  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');
  const [listchat, setListChat] = useState([]);
  const [socketio, setSocketio] = useState(null);
  const [form, setForm] = useState({
    username: detailUser.username,
    email: detailUser.email,
    phone: detailUser.phone,
    fullname: detailUser.fullname,
    bio: detailUser.bio
  });

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);
    socket.on('send-message-response', (response) => {
      const receiver = localStorage.getItem('receiver');
      if (receiver === response[0].sender_id || receiver === response[0].receiver_id) {
        setListChat(response);
      }
    });
    setSocketio(socket);
  }, []);

  // ----------------select receiver---------------
  const [rightDisplay, setRightDisplay] = useState(false);
  const [activeReceiver, setActiveReceiver] = useState({});
  const selectReceiver = (item) => {
    setRightDisplay(true);
    setListChat([]);
    setActiveReceiver(item);
    localStorage.setItem('receiver', item.id);
    socketio.emit('join-room', detailUser);
    const data = {
      sender: detailUser.id,
      receiver: item.id
    };
    socketio.emit('chat-history', data);
  };

  const user = jwtDecode(token);
  useEffect(() => {
    dispatch(getAllUser());

    // ----user detailUser----
    dispatch(getUserDetailId(user.id));
  }, []);

  // -------------------send message------------------
  const onSubmitMessage = (e) => {
    e.preventDefault();
    setProfileUser(false);
    const user = jwtDecode(token);
    // const receiver = localStorage.getItem("receiver");
    const payload = {
      sender: user.fullname,
      receiver: activeReceiver.fullname,
      message,
      receiver_id: activeReceiver.id,
      sender_id: user.id
    };
    setListChat([...listchat, payload]);
    const data = {
      sender: user.id,
      receiver: activeReceiver.id,
      message
    };
    socketio.emit('send-message', data);
    setMessage('');
  };

  // ---------------------search-------------------
  const [querySearch, setQuerySearch] = useState({
    value: ''
  });
  const onSearch = (e) => {
    e.preventDefault();

    dispatch(getAllUser(querySearch.value));
  };

  const onLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Logout',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes Logout'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate(`/`);
        Swal.fire('Logout', 'success');
      }
    });
  };

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [buttonVisibility, setButtonVisibility] = useState(false);
  const photoSubmit = (e) => {
    e.preventDefault();
    setLoading(false);
    if (loading == false) {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', photo);
      updatePhoto(formData)
        .then(() => {
          Swal.fire({
            title: 'Success!',
            text: 'Success Update photo',
            icon: 'success'
          }).then(() => {
            setButtonVisibility(!buttonVisibility);
            dispatch(getUserDetailId(user.id));
          });
        })
        .catch((err) => {
          Swal.fire({
            title: 'Error!',
            text: err.response.data.error,
            icon: 'error'
          }).then(() => {
            setButtonVisibility(!buttonVisibility);
          });
        });
    }
  };

  const [setting, setSetting] = useState(false);
  const onSetting = (e) => {
    e.preventDefault();
    setSetting(true);
    dispatch(getUserDetailId(user.id));
  };

  const onBack = (e) => {
    e.preventDefault();
    setSetting(false);
  };

  const onEdit = (e) => {
    e.preventDefault();
    setLoading(false);
    if (loading == false) {
      if (form.username === '') {
        Swal.fire({
          title: 'Error!',
          text: `Username Can't be empty`,
          icon: 'error'
        });
      } else if (form.fullname === '') {
        Swal.fire({
          title: 'Error!',
          text: `Name Can't be empty`,
          icon: 'error'
        });
      } else if (form.bio === '') {
        Swal.fire({
          title: 'Error!',
          text: `Biodata Can't be empty`,
          icon: 'error'
        });
      } else if (form.phone === '') {
        Swal.fire({
          title: 'Error!',
          text: `phone Can't be empty`,
          icon: 'error'
        });
      } else {
        setLoading(true);
        updateUser(form)
          .then((res) => {
            Swal.fire({
              title: 'Success!',
              text: res.message,
              icon: 'success'
            }).then(() => {
              dispatch(getUserDetailId(user.id));
            });
          })
          .catch((err) => {
            Swal.fire({
              title: 'Error!',
              text: err.response.data.message,
              icon: 'error'
            });
          });
      }
    }
  };

  const [profileUser, setProfileUser] = useState(false);
  const onProfile = (e) => {
    e.preventDefault();
    setProfileUser(true);
    // dispatch(getUserDetailId(user.id));
  };

  const onBackProfile = (e) => {
    e.preventDefault();
    setProfileUser(false);
  };

  return (
    <>
      <section className={`container-fluid ${styles}`}>
        <div className={`row ${styles}`}>
          {/* ----------------------left---------------------- */}
          <div className={`col-4 ${styles.leftContent}`}>
            <div className="row">
              <div className="col-1"></div>
              <div className="col-11">
                {/* -------1---------- */}
                <div className={`row ${styles.content1}`}>
                  <div className={`col-5 ${styles.titleTelegram}`}>
                    <h4>Telegram</h4>
                  </div>
                  <div className={`col-6 ${styles.burger}`}>
                    <div>
                      <img
                        onClick={() =>
                          document.getElementById('clickBurger').style.display === 'none'
                            ? (document.getElementById('clickBurger').style.display = '')
                            : (document.getElementById('clickBurger').style.display = 'none')
                        }
                        className={styles.imgBurger}
                        src={burger}
                        alt="burger"
                      />
                    </div>
                  </div>
                  <div
                    style={{ display: 'none' }}
                    id="clickBurger"
                    className={`col-8 ${styles.clickBurger}`}>
                    <div className={` ${styles.iconTitle}`}>
                      <div
                        className={`col-4`}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                        <img className={styles.iconImage} src={gear} alt="gear" />
                      </div>
                      <div onClick={(e) => onSetting(e)} style={{ cursor: 'pointer' }}>
                        Settings
                      </div>
                    </div>
                    <div className={` ${styles.iconTitle}`}>
                      <div
                        className={`col-4`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <img className={styles.iconImage} src={contact} alt="contact" />
                      </div>
                      <div style={{ cursor: 'pointer' }}>Contact</div>
                    </div>
                    <div className={` ${styles.iconTitle}`}>
                      <div
                        className={`col-4`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <img className={styles.iconImage} src={call} alt="call" />
                      </div>
                      <div style={{ cursor: 'pointer' }}>Calls</div>
                    </div>
                    <div className={` ${styles.iconTitle}`}>
                      <div
                        className={`col-4`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <img className={styles.iconImage} src={save} alt="save" />
                      </div>
                      <div style={{ cursor: 'pointer' }}>Save messages</div>
                    </div>
                    <div className={` ${styles.iconTitle}`}>
                      <div
                        className={`col-4`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <img className={styles.iconImage} src={invite} alt="invite" />
                      </div>
                      <div style={{ cursor: 'pointer' }}>Invite friends</div>
                    </div>
                    <div className={` ${styles.iconTitle}`}>
                      <div
                        className={`col-4`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        <img className={styles.iconImage} src={faq} alt="faq" />
                      </div>
                      <div onClick={(e) => onLogout(e)} style={{ cursor: 'pointer' }}>
                        Logout
                      </div>
                    </div>
                  </div>
                </div>

                {/* -------2---------- */}
                <div className={`row ${styles.content2}`}>
                  <form onSubmit={(e) => onSearch(e)} className={`col-9 ${styles.divSearch}`}>
                    <div className="col-1">
                      <img className={styles.imgBurger} src={search} alt="search" />
                    </div>
                    <input
                      onChange={(e) =>
                        setQuerySearch({
                          ...querySearch,
                          value: e.target.value
                        })
                      }
                      placeholder=" Type your message"
                      className={styles.input}
                      type="text"
                    />
                  </form>
                  <div className={`col-2 ${styles.plus}`}>
                    <img className={styles.imgPlus} src={plus} alt="plus" />
                  </div>
                </div>

                {/* -------3---------- */}
                <div className={`row ${styles.content3}`}>
                  <div className={`col-3 `}>
                    <h6 className={styles.h6}>All</h6>
                  </div>
                  <div className={`col-5`}>
                    <h6 className={styles.h6}>Important</h6>
                  </div>
                  <div className={`col-4 `}>
                    <h6 className={styles.h6}>Unread</h6>
                  </div>
                </div>

                {/* -------4---------- */}
                {allUser.map((item, index) =>
                  item.id !== detailUser.id ? (
                    <div
                      onClick={() => selectReceiver(item)}
                      key={index}
                      className={`row ${styles.content4}`}
                      style={{ cursor: 'pointer' }}>
                      <div className={`col-2 ${styles.divImage}`}>
                        <img
                          className={styles.imageProfile}
                          src={`${process.env.REACT_APP_BACKEND_URL}users/${item.photo}`}
                          alt="profile"
                          onError={(e) => {
                            e.target.src = `${process.env.REACT_APP_BACKEND_URL}users/profile-default.png`;
                          }}
                        />
                      </div>
                      <div className={`col-7  ${styles}`}>
                        <div>
                          <h6>{item.fullname}</h6>
                        </div>
                        <div style={{ color: '#7E98DF' }}>massage</div>
                      </div>
                      <div className={`col-2  ${styles}`}>
                        <div>12.00</div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>

            {/* //////////////////////////////////////////////////// */}
            {setting ? (
              <div className={`row ${styles.settingContent}`}>
                <div className="col-1"></div>
                <div className="col-11">
                  {/* -------1---------- */}
                  <div className={`row ${styles.content1}`}>
                    <div className={`col-3 ${styles.titleTelegram}`}>
                      <img
                        onClick={(e) => onBack(e)}
                        className={styles.imgBurger}
                        src={backIcon}
                        alt="backIcon"
                      />
                    </div>
                    <div className={`col-8 ${styles}`}>
                      <div>
                        <h4>Edit Profile</h4>
                      </div>
                    </div>
                  </div>

                  {/* -------2---------- */}
                  <div className={styles.divPhotoprofile}>
                    <div style={{ marginBottom: '5px' }}>
                      <img
                        className={styles.imageEditProfile}
                        src={`${process.env.REACT_APP_BACKEND_URL}users/${detailUser.photo}`}
                        alt="profile"
                        onError={(e) => {
                          e.target.src = `${process.env.REACT_APP_BACKEND_URL}users/profile-default.png`;
                        }}
                      />
                    </div>
                    <div className={styles.divEditImage}>
                      <form onSubmit={(e) => photoSubmit(e)}>
                        <input
                          type="file"
                          id="photo"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            setPhoto(e.target.files[0]);
                            setButtonVisibility(!buttonVisibility);
                          }}
                        />
                        <input type="submit" id="submit" style={{ display: 'none' }} />
                      </form>
                      {buttonVisibility ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              document.getElementById('submit').click();
                            }}
                            style={{
                              width: 'auto',
                              height: '30px',
                              backgroundColor: '#FFFFFF',
                              border: '2px solid #9ea0a5',
                              color: '#9ea0a5',
                              borderRadius: '10px',
                              fontSize: '15px',
                              marginBottom: '0px'
                            }}>
                            {loading ? 'Loading..' : 'Upload'}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={styles.divButonEdit}
                            onClick={() => {
                              document.getElementById('photo').click();
                            }}>
                            <div className={styles}>
                              <img style={{ width: '20px', marginRight: '5px' }} src={editIcon} />
                            </div>
                            <div className={styles.titleEdit}>Edit</div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h5 className={styles.divLabel}>Account</h5>
                    <form onSubmit={(e) => onEdit(e)}>
                      <div className={styles.divLabel}>
                        <label>Name</label>
                        <div>
                          <input
                            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                            defaultValue={form.fullname}
                            className={styles.inputProfile}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className={styles.divLabel}>
                        <label>Username</label>
                        <div>
                          <input
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            defaultValue={form.username}
                            className={styles.inputProfile}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className={styles.email}>
                        <label>Email</label>
                        <div>
                          <input
                            defaultValue={form.email}
                            className={styles.inputProfile}
                            disabled
                            type="email"
                          />
                        </div>
                      </div>
                      <div className={styles.divLabel}>
                        <label>Phone</label>
                        <div>
                          <input
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            value={form.phone}
                            className={styles.inputProfile}
                            type="number"
                          />
                        </div>
                      </div>
                      <div className={styles.divLabel}>
                        <label>Biodata</label>
                        <div>
                          <textarea
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            defaultValue={form.bio}
                            className={styles.inputBio}></textarea>
                        </div>
                      </div>
                      <div className={styles.divButonProfile}>
                        <button type="submit" className={styles.buttonProfile}>
                          <h6>Save</h6>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* -------------------right------------------------- */}
          <div className={`col-8 ${styles.rightContent}`}>
            {rightDisplay ? (
              <div>
                {/* ------------1. info contact ------------ */}
                <div className={`row ${styles.infoContact}`}>
                  <div className={`row ${styles.firstContent}`}>
                    <div className={`col-6 ${styles.rightContact}`}>
                      <img
                        className={styles.imageProfile}
                        src={`${process.env.REACT_APP_BACKEND_URL}users/${activeReceiver.photo}`}
                        alt="profile"
                        onError={(e) => {
                          e.target.src = `${process.env.REACT_APP_BACKEND_URL}users/profile-default.png`;
                        }}
                      />
                      <div className={styles.fullname}>
                        <h6>{activeReceiver.fullname}</h6>
                        <div style={{ color: '#7e98df', fontSize: 'large' }}>online</div>
                      </div>
                    </div>
                    <div className={`col-5 ${styles.leftContact}`}>
                      <img
                        onClick={(e) => onProfile(e)}
                        className={styles.prifileMenu}
                        src={profileMenu}
                        alt="profileMenu"
                      />
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------- */}
                {profileUser ? (
                  <div className={`row ${styles.settingContentRigh}`}>
                    <div className="col-1"></div>
                    <div className="col-11">
                      <div className={`row ${styles.content1}`}>
                        <div className={`col-3 ${styles.titleTelegram}`}>
                          <img
                            onClick={(e) => onBackProfile(e)}
                            className={styles.imgBurger}
                            src={backIcon}
                            alt="backIcon"
                          />
                        </div>
                        <div className={`col-8 ${styles}`}>
                          <div>
                            <h4>Profile</h4>
                          </div>
                        </div>
                      </div>

                      <div className={styles.divPhotoprofile}>
                        <div style={{ marginBottom: '5px' }}>
                          <img
                            className={styles.imageEditProfile}
                            src={`${process.env.REACT_APP_BACKEND_URL}users/${activeReceiver.photo}`}
                            alt="profile"
                            onError={(e) => {
                              e.target.src = `${process.env.REACT_APP_BACKEND_URL}users/profile-default.png`;
                            }}
                          />
                        </div>

                        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                          <h5>{activeReceiver.fullname}</h5>
                        </div>
                      </div>
                      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                        <h6>Phone Number</h6>
                        <div>{activeReceiver.phone}</div>
                      </div>
                      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                        <h6>Email</h6>
                        <div>{activeReceiver.email}</div>
                      </div>
                      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                        <h6>Username</h6>
                        <div>{activeReceiver.username}</div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* --------------------------------------------------------- */}

                {/* ------------2. chat ---------- */}
                <div className={`row ${styles.secondContent}`}>
                  {listchat.map((item, index) => (
                    <div key={index}>
                      {item.sender_id === detailUser.id ? (
                        <div className={`${styles.leftChat}`}>
                          <div className={styles.myChat}>{item.message}</div>
                          <div>
                            <img
                              className={styles.imgChat}
                              src={`${process.env.REACT_APP_BACKEND_URL}users/${detailUser.photo}`}
                              alt="profileEx"
                              onError={(e) => {
                                e.target.src = `${process.env.REACT_APP_BACKEND_URL}users/profile-default.png`;
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className={`${styles.rightChat}`}>
                          <div>
                            <img
                              className={styles.imgChat}
                              src={`${process.env.REACT_APP_BACKEND_URL}users/${activeReceiver.photo}`}
                              alt="profile"
                              onError={(e) => {
                                e.target.src = `${process.env.REACT_APP_BACKEND_URL}users/profile-default.png`;
                              }}
                            />
                          </div>
                          <div className={styles.chat}>{item.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* ------------3. insert chat ----------- */}
                <div className={`row ${styles.insertChat}`}>
                  <div className={styles.sendChat}>
                    <div className={`col-10 ${styles.divInputMsg}`}>
                      <form onSubmit={onSubmitMessage}>
                        <input
                          onClick={(e) => {
                            setProfileUser(false);
                            setSetting(false);
                          }}
                          onChange={(e) => setMessage(e.target.value)}
                          value={message}
                          className={`col-12 ${styles.inputMessage}`}
                          placeholder=" Type your message..."
                          type="text"
                          required
                        />
                      </form>
                    </div>
                    <div>
                      <img
                        style={{ marginRight: '15px', cursor: 'pointer' }}
                        src={plus}
                        alt="plus"
                      />
                    </div>
                    <div>
                      <img
                        style={{ marginRight: '15px', cursor: 'pointer' }}
                        src={emot}
                        alt="emot"
                      />
                    </div>
                    <div>
                      <img style={{ cursor: 'pointer' }} src={postimage} alt="postimage" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  color: '#848484',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100vh',
                  fontSize: 'larger'
                }}>
                <div>Please select a chat to start messaging</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
