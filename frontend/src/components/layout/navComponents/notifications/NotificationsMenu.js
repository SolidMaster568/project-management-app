import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { discardNotification } from '../../../../redux/actions/userActions';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import LocalFloristIcon from '@material-ui/icons/LocalFlorist';

import NotificationItem from './NotificationItem';

const useStyles = makeStyles((theme) => ({
  menuContainer: {
    maxHeight: 350,
    overflow: 'auto',
    width: 450,
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      minWidth: 300,
    },
  },
  header: {
    padding: '5px 15px',
    color: '#777777',
    fontWeight: 600,
    backgroundColor: '#d6ecff',
    borderBottom: '1px solid #e8e2e2',
    outline: 'none',
  },
  emptyContainer: {
    padding: 10,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  emptyIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: 10,
  },
}));

const NotificationsMenu = ({ anchorEl, handleClose }) => {
  const { socket } = useSelector((state) => state.socketConnection);
  const { notifications } = useSelector((state) => state.userLogin);
  const [notificationsIndexes, setNotificationsIndexes] = useState([]);
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  // Keeps track of which notifications are "opened", meaning have discard and accept buttons displayed
  const projectNotificationHandle = (index) => {
    // remove index from array
    const value = notificationsIndexes.indexOf(index);
    if (value !== -1) {
      setNotificationsIndexes((prevIndexes) => {
        const array = [...prevIndexes];
        array.splice(value, 1);
        return array;
      });
    } else {
      // push index of the clicked notification to the array
      setNotificationsIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };

  const discardNotificationHandle = (notificationId, index) => {
    dispatch(discardNotification(notificationId, index));
  };

  const actionHandle = (notification) => {
    console.log('join project');
    if (notification.type === 'Project Invitation') {
      socket.emit(
        'project-join',
        { projectId: notification.project._id },
        () => {
          handleClose();
          history.push(`/project/${notification.project._id}`);
        }
      );
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      MenuListProps={{ style: { padding: 0 } }}
    >
      <Typography variant='subtitle1' className={classes.header}>
        Notifications
      </Typography>
      <div className={classes.menuContainer}>
        {notifications.items.length > 0 ? (
          notifications.items.map((notification, index) => (
            <NotificationItem
              key={index}
              projectNotificationHandle={projectNotificationHandle}
              actionHandle={actionHandle}
              discardNotificationHandle={discardNotificationHandle}
              notificationsIndexes={notificationsIndexes}
              notification={notification}
              index={index}
            />
          ))
        ) : (
          <MenuItem disabled style={{ padding: 0 }}>
            <div className={classes.emptyContainer}>
              <LocalFloristIcon className={classes.emptyIcon} />
              <Typography variant='body2'>Nothing to see here</Typography>
            </div>
          </MenuItem>
        )}
      </div>
    </Menu>
  );
};

export default NotificationsMenu;