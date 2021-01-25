import {
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_RESET,
  PROJECT_SET_CURRENT,
  PROJECT_SET_CURRENT_RESET,
  PROJECT_DATA_REQUEST,
  PROJECT_DATA_SUCCESS,
  PROJECT_DATA_FAIL,
  PROJECT_DATA_RESET,
  PROJECT_DATA_ADD_TASK,
  PROJECT_TASK_MOVE,
  PROJECT_TASK_MOVE_RESET,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_DATA_MOVE_TASK,
  PROJECT_DATA_ADD_LIST,
  PROJECT_DATA_LIST_TITLE_UPDATE,
  PROJECT_DATA_TITLE_UPDATE,
  PROJECT_FIND_USERS_REQUEST,
  PROJECT_FIND_USERS_SUCCESS,
  PROJECT_FIND_USERS_FAIL,
  PROJECT_DATA_JOIN_LINK_UPDATE,
  PROJECT_DATA_USERS_UPDATE,
} from '../constants/projectConstants';
import deepcopy from 'deepcopy';

export const projectCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PROJECT_CREATE_REQUEST:
      return { loading: true };
    case PROJECT_CREATE_SUCCESS:
      return {
        loading: false,
        project: action.payload.project,
      };
    case PROJECT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PROJECT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const projectSetCurrentReducer = (state = {}, action) => {
  switch (action.type) {
    case PROJECT_SET_CURRENT:
      return { project: action.payload };
    case PROJECT_DATA_TITLE_UPDATE: {
      const stateClone = deepcopy(state);
      stateClone.project.title = action.payload.title;
      return stateClone;
    }
    case PROJECT_SET_CURRENT_RESET:
      return {};
    default:
      return state;
  }
};

export const projectGetDataReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PROJECT_DATA_REQUEST:
      return { loading: true };
    case PROJECT_DATA_SUCCESS:
      return {
        loading: false,
        project: action.payload.project,
        lists: action.payload.lists,
        labels: action.payload.labels,
      };
    case PROJECT_DATA_ADD_TASK: {
      const stateClone = deepcopy(state);
      const listIndex = stateClone.lists.lists.findIndex(
        (list) => list._id === action.payload.listId
      );
      stateClone.lists.lists[listIndex].tasks.push(action.payload.task);
      return stateClone;
    }
    case PROJECT_DATA_UPDATE_LISTS: {
      return { ...state, lists: action.payload };
    }
    case PROJECT_DATA_MOVE_TASK: {
      const {
        payload: { added, removed, task },
      } = action;
      const stateCopy = deepcopy(state);
      stateCopy.lists.lists[removed.listIndex].tasks.splice(removed.index, 1);
      stateCopy.lists.lists[added.listIndex].tasks.splice(added.index, 0, task);
      return stateCopy;
    }
    case PROJECT_DATA_ADD_LIST: {
      const stateClone = Object.assign({}, state);
      stateClone.lists.lists.push(action.payload.list);
      return stateClone;
    }
    case PROJECT_DATA_LIST_TITLE_UPDATE: {
      const {
        payload: { listIndex, title },
      } = action;
      const stateClone = deepcopy(state);
      stateClone.lists.lists[listIndex].title = title;
      return stateClone;
    }
    case PROJECT_DATA_TITLE_UPDATE: {
      const stateClone = deepcopy(state);
      stateClone.project.title = action.payload.title;
      return stateClone;
    }
    case PROJECT_DATA_JOIN_LINK_UPDATE: {
      const stateClone = deepcopy(state);
      stateClone.project.joinId = action.payload.joinId;
      stateClone.project.joinIdActive = action.payload.joinIdActive;
      return stateClone;
    }
    case PROJECT_DATA_USERS_UPDATE: {
      const stateClone = deepcopy(state);
      stateClone.users = action.payload;
      return stateClone;
    }
    case PROJECT_DATA_FAIL:
      return { loading: false, error: action.payload };
    case PROJECT_DATA_RESET:
      return {};
    default:
      return state;
  }
};

export const projectTaskMoveReducer = (
  state = { removed: null, added: null },
  action
) => {
  switch (action.type) {
    case PROJECT_TASK_MOVE:
      const {
        payload: { removed, added },
      } = action;
      if (removed && added) return { removed, added };
      else if (removed) return { ...state, removed };
      else if (added) return { ...state, added };
      return state;
    case PROJECT_TASK_MOVE_RESET:
      return { removed: null, added: null };
    default:
      return state;
  }
};

export const projectFindUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case PROJECT_FIND_USERS_REQUEST:
      return { loading: true };
    case PROJECT_FIND_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
      };
    case PROJECT_FIND_USERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};