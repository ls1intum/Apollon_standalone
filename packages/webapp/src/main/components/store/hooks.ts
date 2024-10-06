import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './application-store';

// export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
// export const useAppSelector = useSelector.<RootState>()

export const useAppDispatch = () => useDispatch<AppDispatch>();
export type MyDispatch = typeof useAppDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export type ThunkApi = object;

// // Explicitly typing the return type of createAsyncAppThunk
// export const createAsyncAppThunk: <Returned, ThunkArg = void>(
//   typePrefix: string,
//   payloadCreator: (
//     arg: ThunkArg,
//     thunkAPI: {
//       dispatch: AppDispatch;
//       getState: () => RootState;
//       extra: ThunkApi;
//       requestId: string;
//       signal: AbortSignal;
//       rejectWithValue: (value: unknown) => unknown;
//     }
//   ) => Promise<Returned> | Returned
// ) => (arg: ThunkArg) => any = createAsyncThunk.withTypes<{
//   dispatch: AppDispatch;
//   extra: ThunkApi;
//   state: RootState;
// }>();

// // Explicitly typing the return type of createAsyncAppThunkReject
// export const createAsyncAppThunkReject = <T>() =>
//   createAsyncThunk.withTypes<{
//     dispatch: AppDispatch;
//     extra: ThunkApi;
//     rejectValue: T;
//     state: RootState;
//   }>();

// // Generic AppThunkAction type for additional use cases
// export type AppThunkAction<T> = ThunkAction<T, RootState, ThunkApi, Action<string>>;
