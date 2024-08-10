import {http} from '~/utils/http';
const getDailyDeals = async () => {
    try {
        const { data } = await http.get(`daily-deals`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
export { getDailyDeals };