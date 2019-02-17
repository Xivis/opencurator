export const UI_UPDATE = 'UI update'

export const updateUI = (payload) => {
  return {
    type: UI_UPDATE,
    payload
  }
}