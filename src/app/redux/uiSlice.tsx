import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface UiState {
  name: string;
  darkMode: boolean;
  isMobileNavOpen: boolean;
  isCreatedNewColumn: boolean;
  isEditedBoard: boolean ;
}


const initialState: UiState = {
  name: "",
  darkMode: false,
  isMobileNavOpen: false,
  isCreatedNewColumn: false,
  isEditedBoard: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDarkMode(state) {
      state.darkMode = !state.darkMode; 
    },
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen; 
    },
 
    setIsCreatedNewColumn(state, action: PayloadAction<boolean>) {
      state.isCreatedNewColumn = action.payload;
    },
    setIsEditedBoard(state, action: PayloadAction<boolean>) {
      state.isEditedBoard = action.payload;
    },
  },
});


export const { setDarkMode, toggleMobileNav, setIsCreatedNewColumn, setIsEditedBoard } =
  uiSlice.actions;


export default uiSlice.reducer;
