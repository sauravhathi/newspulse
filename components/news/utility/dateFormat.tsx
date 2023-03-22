import moment from 'moment';

// date format function for news cards
export const dateFormat = (datePublished: any) => {
    const date = moment(datePublished);
    const formattedDate = date.format('MMMM D, YYYY h:mm A');
    return formattedDate;
}