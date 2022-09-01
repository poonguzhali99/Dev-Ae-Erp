import moment from "moment";
export const formatDate = (date) => {
  if (date) {
    const formattedDate = moment(date);
    return formattedDate._isValid === true ? formattedDate.format("MMM Do, YYYY") : date;
  }

  return date;
};
