import Notification from 'vj/components/notification';
import i18n from 'vj/utils/i18n';

export default function reducer(state = {
  main: {
    size: '50%',
  },
  pretest: {
    visible: localStorage.getItem('scratchpad/pretest') === 'true',
    size: 200,
  },
  records: {
    visible: UiContext.canViewRecord && localStorage.getItem('scratchpad/records') === 'true',
    size: 200,
    isLoading: false,
  },
  isPosting: false,
}, action) {
  switch (action.type) {
  case 'SCRATCHPAD_UI_CHANGE_SIZE': {
    const { uiElement, size } = action.payload;
    return {
      ...state,
      [uiElement]: {
        ...state[uiElement],
        size,
      },
    };
  }
  case 'SCRATCHPAD_UI_SET_VISIBILITY': {
    const { uiElement, visibility } = action.payload;
    localStorage.setItem(`scratchpad/${uiElement}`, visibility.toString());
    return {
      ...state,
      [uiElement]: {
        ...state[uiElement],
        visible: visibility,
      },
    };
  }
  case 'SCRATCHPAD_UI_TOGGLE_VISIBILITY': {
    const { uiElement } = action.payload;
    localStorage.setItem(`scratchpad/${uiElement}`, (!state[uiElement].visible).toString());
    return {
      ...state,
      [uiElement]: {
        ...state[uiElement],
        visible: !state[uiElement].visible,
      },
    };
  }
  case 'SCRATCHPAD_POST_PRETEST_PENDING':
  case 'SCRATCHPAD_POST_SUBMIT_PENDING': {
    return {
      ...state,
      isPosting: true,
    };
  }
  case 'SCRATCHPAD_POST_PRETEST_FULFILLED':
  case 'SCRATCHPAD_POST_SUBMIT_FULFILLED': {
    Notification.success(i18n('Submitted.'));
    return {
      ...state,
      isPosting: false,
    };
  }
  case 'SCRATCHPAD_POST_PRETEST_REJECTED':
  case 'SCRATCHPAD_POST_SUBMIT_REJECTED': {
    Notification.error(action.payload.message);
    return {
      ...state,
      isPosting: false,
    };
  }
  case 'SCRATCHPAD_RECORDS_LOAD_SUBMISSIONS_PENDING': {
    return {
      ...state,
      records: {
        ...state.records,
        isLoading: true,
      },
    };
  }
  case 'SCRATCHPAD_RECORDS_LOAD_SUBMISSIONS_REJECTED': {
    Notification.error(action.payload.message);
    return {
      ...state,
      records: {
        ...state.records,
        isLoading: false,
      },
    };
  }
  case 'SCRATCHPAD_RECORDS_LOAD_SUBMISSIONS_FULFILLED': {
    return {
      ...state,
      records: {
        ...state.records,
        isLoading: false,
      },
    };
  }
  default:
    return state;
  }
}
