// 1. Action Types (Constants to prevent typos)
export const ACTION_TYPES = {
  UPDATE_PROFILE: "profile/update",
  UPDATE_EB_CARD: "ebCard/update",
  UPDATE_METER: "meter/update",
};

// 2. The Refined Reducer (Pure function handling how actions mutate state)
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };
    case ACTION_TYPES.UPDATE_EB_CARD:
      return {
        ...state,
        ebCardDetail: { ...state.ebCardDetail, ...action.payload },
      };
    case ACTION_TYPES.UPDATE_METER:
      return {
        ...state,
        MeterReading: { ...state.MeterReading, ...action.payload },
      };
    default:
      return state;
  }
}

// 3. The Refined StateStore
class StateStore {
  constructor(reducer, initialState = {}) {
    this.reducer = reducer;
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  // The single entry point to modify state via explicitly named actions
  dispatch(action) {
    const oldState = this.state;
    this.state = this.reducer(oldState, action);

    // Notify targeted slice listeners
    this.listeners.forEach((listener) =>
      listener.callback(this.state, oldState),
    );
  }

  // Slice-specific subscription
  subscribe(selector, callback) {
    let lastSelectedState = selector(this.state);

    const internalCallback = (currentState) => {
      const currentSelectedState = selector(currentState);
      if (currentSelectedState !== lastSelectedState) {
        lastSelectedState = currentSelectedState;
        callback(currentSelectedState);
      }
    };

    this.listeners.push({ callback: internalCallback, original: callback });
    return () => {
      this.listeners = this.listeners.filter((l) => l.original !== callback);
    };
  }
}

// ==========================================
// Usage Example across your SPA classes
// ==========================================

// Initial App State
const initialState = {
  userProfile: { name: "John", email: "john@example.com" },
  ebCardDetail: { consumerNumber: "98765", tariff: "Domestic" },
  MeterReading: { currentReading: 1000 },
};

// Create the unified store instance
export const store = new StateStore(appReducer, initialState);
