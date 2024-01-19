import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export const usePhotoEditorStore = create(
	immer((set, get) => ({
		rectangles: [],
		setRectangles: rectangles => {
			set(state => {
				state.rectangles = rectangles
			})
		},
		addRectangles: rectangle => {
			set(state => {
				state.rectangles = [get().rectangles, rectangle]
			})
		},
	}))
)
