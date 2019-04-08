export const MODES = Object.freeze({
  EDIT: "edit",
  LOAD: "load"
});

export const extractDataSource = path => {
  const tab = path.split("-");
  return tab[0];
};
