import { useReducer } from 'react';

function useForm() {
  let [state, dispatch] = useReducer(formReducer, { values: {}, errors: {} });

  let actions = {
    setField(fieldName: string, value: any) {
      dispatch({ type: 'set', payload: { fieldName, value } });
    },
  };

  return [state, actions];
}

function formReducer(state: any, action: any) {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        values: { ...state.values, [action.payload.fieldName]: action.payload.value },
      };
    default:
      return state;
  }
}

export default useForm;
